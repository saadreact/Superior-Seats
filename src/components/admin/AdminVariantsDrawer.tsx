import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, FormControl, Select, MenuItem, Button, CircularProgress, Chip, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { CustomizedSeatApi } from '@/services/CustomizedSeatApi';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import shopNowApis, { PriceTier as ShopPriceTier, User as ShopUser } from '@/services/ShopNowApis';

export interface VariantSelections {
	materialType?: string | number;
	color?: string | number;
	seatStitchPattern?: string | number;
	reclineType?: string | number;
	lumbarType?: string | number;
	heatOption?: string | number;
	seatType?: string | number;
	itemType?: string | number;
	seatStyle?: string | number;
	relaxor?: string | number;
	armType?: string | number;
	// 3D customization colors
	externalStitchColor?: string;
	pipingColor?: string;
	// 3D customization data (stored as JSON string in variants.customizationData)
	customizationData?: string;
}

interface AdminVariantsDrawerProps {
	open: boolean;
	onClose: () => void;
	productId: number | null;
	initialSelections?: VariantSelections | null;
	basePrice?: number;
	onApply: (payload: { selections: VariantSelections; newUnitPrice: number }) => void;
	onPreview?: (payload: { selections: VariantSelections; newUnitPrice: number }) => void;
	readOnly?: boolean;
	// New: when provided, use this customer's price tier for discounting instead of logged-in user
	customerTierId?: number;
	// New: use this price for initial display before any interaction (e.g., already-discounted unit price)
	initialDisplayPrice?: number;
}

const AdminVariantsDrawer: React.FC<AdminVariantsDrawerProps> = ({ 
	open, 
	onClose, 
	productId, 
	initialSelections, 
	basePrice = 0, 
	onApply, 
	onPreview, 
	readOnly,
	customerTierId,
	initialDisplayPrice,
}) => {
	const auth = useAppSelector((s: any) => s.auth);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [variations, setVariations] = useState<any>(null);
	// Parse customizationData from variants if present
	const parseCustomizationData = (selections: VariantSelections | null | undefined) => {
		if (!selections) return { externalStitchColor: '', pipingColor: '' };
		
		// Check if customizationData is a JSON string in variants
		let customizationData: any = null;
		if (selections.customizationData) {
			try {
				customizationData = typeof selections.customizationData === 'string' 
					? JSON.parse(selections.customizationData) 
					: selections.customizationData;
			} catch (e) {
				console.error('Failed to parse customizationData:', e);
			}
		}
		
		return {
			externalStitchColor: selections.externalStitchColor || customizationData?.externalStitchColor || '',
			pipingColor: selections.pipingColor || customizationData?.pipingColor || '',
		};
	};

	const [selections, setSelections] = useState<VariantSelections>({
		materialType: initialSelections?.materialType || '',
		color: initialSelections?.color || '',
		seatStitchPattern: initialSelections?.seatStitchPattern || '',
		reclineType: initialSelections?.reclineType || '',
		lumbarType: initialSelections?.lumbarType || '',
		heatOption: initialSelections?.heatOption || '',
		seatType: initialSelections?.seatType || '',
		itemType: initialSelections?.itemType || '',
		seatStyle: initialSelections?.seatStyle || '',
		armType: initialSelections?.armType || '',
		...parseCustomizationData(initialSelections),
	});
	const [priceTiers, setPriceTiers] = useState<ShopPriceTier[]>([]);
	const [userData, setUserData] = useState<ShopUser | null>(null);
	const [hasInteracted, setHasInteracted] = useState(false);

	// Load variations and pricing context when drawer opens
	useEffect(() => {
		if (!open || !productId) return;
		setLoading(true);
		setError(null);

		Promise.all([
			CustomizedSeatApi.getProductById(productId),
			shopNowApis.getPriceTiers(),
			auth?.isAuthenticated ? shopNowApis.getCurrentUser() : Promise.resolve(null as any),
		])
			.then(([product, tiersRes, userRes]) => {
				setVariations({
					colors: product.colors || [],
					material_types: product.material_types || [],
					heat_options: product.heat_options || [],
					lumbar_types: product.lumbar_types || [],
					recline_types: product.recline_types || [],
					seat_stitch_patterns: product.seat_stitch_patterns || [],
					arm_types: product.arm_types || [],
					seat_types: product.seat_types || [],
					seat_styles: product.seat_styles || [],
					relaxors: product.relaxors || [],
					item_types: product.item_types || [],
				});
				const tiersPayload = (tiersRes as any)?.data ?? tiersRes ?? [];
				setPriceTiers(Array.isArray(tiersPayload) ? tiersPayload : []);
				setUserData((userRes as any)?.data || userRes || null);

				if (initialSelections) {
					setSelections({
						materialType: initialSelections.materialType || '',
						color: initialSelections.color || '',
						seatStitchPattern: initialSelections.seatStitchPattern || '',
						reclineType: initialSelections.reclineType || '',
						lumbarType: initialSelections.lumbarType || '',
						heatOption: initialSelections.heatOption || '',
					seatType: initialSelections.seatType || '',
					itemType: initialSelections.itemType || '',
					seatStyle: initialSelections.seatStyle || '',
					relaxor: initialSelections.relaxor || '',
					armType: initialSelections.armType || '',
						...parseCustomizationData(initialSelections),
					});
				}
			})
			.catch(e => {
				console.error('Failed to load drawer data', e);
				setError('Failed to load product variations');
			})
			.finally(() => setLoading(false));
	}, [open, productId, initialSelections, auth?.isAuthenticated]);

	const getItemPrice = (item: any): number => {
		if (!item) return 0;
		return parseFloat(item.price) || 0;
	};
	const getDisplayPrice = (value: number): number => {
		// If admin passed a customerTierId, prefer that for discounting
		if (customerTierId && priceTiers.length > 0) {
			const fakeUser: any = { role: { price_tier_id: customerTierId } };
			return shopNowApis.getDisplayPrice(value, true, fakeUser, priceTiers);
		}
		return shopNowApis.getDisplayPrice(value, !!auth?.isAuthenticated, userData, priceTiers);
	};

	const getVariantPrice = (key: keyof VariantSelections): number => {
		if (!variations || !selections[key]) return 0;
		// Exclude non-priced fields (customization colors don't have prices)
		if (key === 'externalStitchColor' || key === 'pipingColor' || key === 'customizationData') {
			return 0;
		}
		const maps: Record<string, any[]> = {
			materialType: variations.material_types,
			color: variations.colors,
			seatStitchPattern: variations.seat_stitch_patterns,
			reclineType: variations.recline_types,
			lumbarType: variations.lumbar_types,
			heatOption: variations.heat_options,
			seatType: variations.seat_types,
			itemType: variations.item_types,
			seatStyle: variations.seat_styles,
			relaxor: variations.relaxors,
			armType: variations.arm_types,
		};
		const list = maps[key] || [];
		const item = list.find((i: any) => i.id == selections[key]);
		return getItemPrice(item);
	};
	const getVariantDisplayPrice = (key: keyof VariantSelections): number => {
		const retail = getVariantPrice(key);
		return getDisplayPrice(retail);
	};

	const totalRetailPrice = useMemo(() => {
		if (!variations) return basePrice;
		const variantRetail = [
			'materialType', 'color', 'seatStitchPattern', 'reclineType', 
			'lumbarType', 'heatOption', 'seatType', 'itemType', 
			'seatStyle', 'relaxor', 'armType'
		].reduce((sum, key) => sum + getVariantPrice(key as keyof VariantSelections), 0);
		return Math.max(0, basePrice + variantRetail);
	}, [variations, selections, basePrice]);

	const totalDisplayPrice = useMemo(() => {
		const computed = getDisplayPrice(totalRetailPrice);
		if (!hasInteracted && typeof initialDisplayPrice === 'number' && !Number.isNaN(initialDisplayPrice)) {
			return initialDisplayPrice;
		}
		return computed;
	}, [totalRetailPrice, priceTiers, userData, auth?.isAuthenticated, customerTierId, hasInteracted, initialDisplayPrice]);

	const updateSelection = (key: keyof VariantSelections, value: any) => {
		if (readOnly) return;
		setHasInteracted(true);
		const newSelections = { ...selections, [key]: value };
		setSelections(newSelections);
		if (onPreview) {
			// Recompute retail and display for preview
			const maps: Record<string, any[]> = {
				materialType: variations?.material_types || [],
				color: variations?.colors || [],
				seatStitchPattern: variations?.seat_stitch_patterns || [],
				reclineType: variations?.recline_types || [],
				lumbarType: variations?.lumbar_types || [],
				heatOption: variations?.heat_options || [],
				seatType: variations?.seat_types || [],
				itemType: variations?.item_types || [],
				seatStyle: variations?.seat_styles || [],
				armType: variations?.arm_types || [],
			};
			const variantRetail = Object.keys(newSelections).reduce((sum, k) => {
				// Skip non-priced fields
				if (k === 'externalStitchColor' || k === 'pipingColor' || k === 'customizationData') {
					return sum;
				}
				const list = maps[k];
				if (!list) return sum;
				const item = list.find((i: any) => i.id == (newSelections as any)[k]);
				return sum + (parseFloat(item?.price) || 0);
			}, 0);
			const retail = Math.max(0, basePrice + variantRetail);
			const display = getDisplayPrice(retail);
			onPreview({ selections: newSelections, newUnitPrice: display });
		}
	};

	const renderPriceBadge = (retail: number) => {
		const display = getDisplayPrice(retail);
		if (display < retail - 0.009) {
			return (
				<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
					<Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700 }}>+${display.toFixed(2)}</Typography>
					<Typography variant="caption" color="text.secondary"><s>${retail.toFixed(2)}</s></Typography>
				</Box>
			);
		}
		return (
			<Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700 }}>+${retail.toFixed(2)}</Typography>
		);
	};

	const renderSelect = (key: keyof VariantSelections, label: string, options: any[]) => {
		const retail = getVariantPrice(key);
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
					<Typography variant="body2">{label}:</Typography>
					{retail > 0 && renderPriceBadge(retail)}
				</Box>
				<FormControl fullWidth disabled={readOnly}>
					<Select
						value={selections[key] || ''}
						displayEmpty
						onChange={(e) => updateSelection(key, e.target.value)}
					>
						<MenuItem value=""><em>Select {label}</em></MenuItem>
						{options.map((option: any) => (
							<MenuItem key={option.id} value={option.id}>
								{option.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
		);
	};

	const renderMaterialGrid = () => {
		const retail = getVariantPrice('materialType');
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Material</Typography>
					{retail > 0 && (
						<Chip size="small" label={`+${getDisplayPrice(retail).toFixed(2)}`} sx={{ color: 'error.main' }} />
					)}
				</Box>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(5, 1fr)' }, gap: 1 }}>
					<Tooltip title="None">
						<Box 
							onClick={() => updateSelection('materialType', '')}
							sx={{ 
								position: 'relative', 
								height: 64, 
								borderRadius: 1, 
								border: '1px dashed #bbb', 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center', 
								cursor: readOnly ? 'not-allowed' : 'pointer', 
								bgcolor: '#fafafa' 
							}}
						>
							<Typography variant="caption" color="text.secondary">None</Typography>
							{!selections.materialType && <CheckCircle sx={{ position: 'absolute', top: 6, right: 6, color: '#d32f2f' }} />}
						</Box>
					</Tooltip>
					{(variations?.material_types || []).map((material: any) => {
						const selected = material.id == selections.materialType;
						return (
							<Tooltip key={material.id} title={material.name}>
								<Box 
									onClick={() => updateSelection('materialType', material.id)}
									sx={{ 
										position: 'relative', 
										height: 64, 
										borderRadius: 1, 
										border: selected ? '2px solid #d32f2f' : '1px solid #ddd', 
										overflow: 'hidden', 
										cursor: readOnly ? 'not-allowed' : 'pointer' 
									}}
								>
									{material.image_url ? (
										<Image src={material.image_url} alt={material.name} fill style={{ objectFit: 'cover' }} />
									) : (
										<Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
											<Typography variant="caption" color="text.secondary">{material.name}</Typography>
										</Box>
									)}
									{selected && <CheckCircle sx={{ position: 'absolute', top: 6, right: 6, color: 'white' }} />}
								</Box>
							</Tooltip>
						);
					})}
				</Box>
			</Box>
		);
	};

	const renderColorGrid = () => {
		const retail = getVariantPrice('color');
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Color</Typography>
					{retail > 0 && (
						<Chip size="small" label={`+${getDisplayPrice(retail).toFixed(2)}`} sx={{ color: 'error.main' }} />
					)}
				</Box>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					<Tooltip title="None">
						<Box 
							onClick={() => updateSelection('color', '')}
							sx={{ 
								width: 36, 
								height: 36, 
								borderRadius: '50%', 
								border: '1px dashed #bbb', 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center', 
								cursor: readOnly ? 'not-allowed' : 'pointer', 
								bgcolor: '#fafafa' 
							}}
						>
							<Typography variant="caption" color="text.secondary">—</Typography>
						</Box>
					</Tooltip>
					{(variations?.colors || []).map((color: any) => {
						const selected = color.id == selections.color;
						return (
							<Tooltip key={color.id} title={color.name}>
								<Box 
									onClick={() => updateSelection('color', color.id)}
									sx={{ 
										position: 'relative', 
										width: 36, 
										height: 36, 
										borderRadius: '50%', 
										border: selected ? '2px solid #d32f2f' : '1px solid #ddd', 
										cursor: readOnly ? 'not-allowed' : 'pointer', 
										bgcolor: color.hex_code || '#ccc' 
									}} 
								/>
							</Tooltip>
						);
					})}
				</Box>
			</Box>
		);
	};

	const renderStitchingGrid = () => {
		const retail = getVariantPrice('seatStitchPattern');
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Stitching Pattern</Typography>
					{retail > 0 && (
						<Chip size="small" label={`+${getDisplayPrice(retail).toFixed(2)}`} sx={{ color: 'error.main' }} />
					)}
				</Box>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1 }}>
					<Tooltip title="None">
						<Box 
							onClick={() => updateSelection('seatStitchPattern', '')}
							sx={{ 
								position: 'relative', 
								height: 64, 
								borderRadius: 1, 
								border: '1px dashed #bbb', 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center', 
								cursor: readOnly ? 'not-allowed' : 'pointer', 
								bgcolor: '#fafafa' 
							}}
						>
							<Typography variant="caption" color="text.secondary">None</Typography>
						</Box>
					</Tooltip>
					{(variations?.seat_stitch_patterns || []).map((pattern: any) => {
						const selected = pattern.id == selections.seatStitchPattern;
						return (
							<Tooltip key={pattern.id} title={pattern.name}>
								<Box 
									onClick={() => updateSelection('seatStitchPattern', pattern.id)}
									sx={{ 
										position: 'relative', 
										height: 64, 
										borderRadius: 1, 
										border: selected ? '2px solid #d32f2f' : '1px solid #ddd', 
										overflow: 'hidden', 
										cursor: readOnly ? 'not-allowed' : 'pointer' 
									}}
								>
									{pattern.image_url ? (
										<Image src={pattern.image_url} alt={pattern.name} fill style={{ objectFit: 'cover' }} />
									) : (
										<Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
											<Typography variant="caption" color="text.secondary">{pattern.name}</Typography>
										</Box>
									)}
								</Box>
							</Tooltip>
						);
					})}
				</Box>
			</Box>
		);
	};

	// Render 3D Customization Colors (External Stitching & Piping)
	const render3DCustomizationColors = () => {
		// Only show if we have color values (from 3D customization)
		if (!selections.externalStitchColor && !selections.pipingColor) return null;

		// Common color palette for display
		const commonColors = [
			{ name: 'White', hex: '#ffffff' },
			{ name: 'Black', hex: '#000000' },
			{ name: 'Red', hex: '#ff0000' },
			{ name: 'Blue', hex: '#0000ff' },
			{ name: 'Green', hex: '#00ff00' },
			{ name: 'Yellow', hex: '#ffff00' },
			{ name: 'Gray', hex: '#808080' },
			{ name: 'Brown', hex: '#8b4513' },
		];

		const getColorName = (hex: string) => {
			const found = commonColors.find(c => c.hex.toLowerCase() === hex.toLowerCase());
			return found?.name || hex;
		};

		return (
			<Box>
				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>3D Customization Colors</Typography>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
					{selections.externalStitchColor && (
						<Box>
							<Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>External Stitching Color:</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box 
									sx={{ 
										width: 32, 
										height: 32, 
										borderRadius: '50%', 
										border: '1px solid #ddd', 
										bgcolor: selections.externalStitchColor || 'transparent',
										display: 'inline-block'
									}} 
								/>
								<Typography variant="body2" fontWeight={600}>
									{getColorName(selections.externalStitchColor)} ({selections.externalStitchColor})
								</Typography>
							</Box>
						</Box>
					)}
					{selections.pipingColor && (
						<Box>
							<Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>Piping Color:</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box 
									sx={{ 
										width: 32, 
										height: 32, 
										borderRadius: '50%', 
										border: '1px solid #ddd', 
										bgcolor: selections.pipingColor || 'transparent',
										display: 'inline-block'
									}} 
								/>
								<Typography variant="body2" fontWeight={600}>
									{getColorName(selections.pipingColor)} ({selections.pipingColor})
								</Typography>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		);
	};

	return (
		<Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 560, md: 780, lg: 900 } } }}>
			<Box sx={{ p: 2, display: 'grid', gap: 2 }}>
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Typography variant="h6">Configure Variants</Typography>
					<IconButton onClick={onClose}><CloseIcon /></IconButton>
				</Box>
				<Divider />
				
				{loading ? (
					<Box display="flex" justifyContent="center" py={4}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Typography color="error">{error}</Typography>
				) : (
					<Box display="grid" gap={2}>
						{renderMaterialGrid()}
						{renderColorGrid()}
						{renderStitchingGrid()}
						{render3DCustomizationColors() && (
							<>
								<Divider />
								{render3DCustomizationColors()}
							</>
						)}
					
						<Divider />
					
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Variation</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
								{renderSelect('reclineType', 'Recline', variations?.recline_types || [])}
								{renderSelect('lumbarType', 'Lumbar', variations?.lumbar_types || [])}
								{renderSelect('heatOption', 'Heat Option', variations?.heat_options || [])}
							</Box>
						</Box>
					
						<Divider />
					
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Seat</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
								{renderSelect('seatType', 'Seat Type', variations?.seat_types || [])}
								{renderSelect('itemType', 'Item Type', variations?.item_types || [])}
								{renderSelect('seatStyle', 'Seat Style', variations?.seat_styles || [])}
								{renderSelect('relaxor', 'Relaxor', variations?.relaxors || [])}
								{renderSelect('armType', 'Arm Type', variations?.arm_types || [])}
							</Box>
						</Box>
					
						<Divider />
						
						{!readOnly && (
							<>
								<Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
									<Typography variant="subtitle1">New Unit Price</Typography>
									<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
										<Chip color="primary" label={`$${totalDisplayPrice.toFixed(2)}`} />
										{totalDisplayPrice < totalRetailPrice - 0.009 && (
											<Typography variant="caption" color="text.secondary"><s>${totalRetailPrice.toFixed(2)}</s></Typography>
										)}
									</Box>
								</Box>
								<Box display="flex" justifyContent="flex-end" gap={1}>
									<Button onClick={onClose}>Cancel</Button>
									<Button variant="contained" onClick={() => onApply({ selections, newUnitPrice: totalDisplayPrice })}>
										Apply
									</Button>
								</Box>
							</>
						)}
						
						{readOnly && (
							<Box display="flex" justifyContent="flex-end">
								<Button variant="contained" onClick={onClose}>Close</Button>
							</Box>
						)}
					</Box>
				)}
			</Box>
		</Drawer>
	);
};

export default AdminVariantsDrawer; 