import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, FormControl, Select, MenuItem, Button, CircularProgress, Chip, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { CustomizedSeatApi } from '@/services/CustomizedSeatApi';
import Image from 'next/image';

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
	armType?: string | number;
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
}

const AdminVariantsDrawer: React.FC<AdminVariantsDrawerProps> = ({ 
	open, 
	onClose, 
	productId, 
	initialSelections, 
	basePrice = 0, 
	onApply, 
	onPreview, 
	readOnly 
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [variations, setVariations] = useState<any>(null);
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
	});

	// Load variations when drawer opens
	useEffect(() => {
		if (!open || !productId) return;
		
		setLoading(true);
		setError(null);
		
		CustomizedSeatApi.getProductById(productId)
			.then(product => {
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
					item_types: product.item_types || [],
				});
			})
			.catch(e => {
				console.error('Failed to load variations', e);
				setError('Failed to load product variations');
			})
			.finally(() => {
				setLoading(false);
			});
	}, [open, productId]);

	const getItemPrice = (item: any): number => {
		if (!item) return 0;
		return parseFloat(item.price) || 0;
	};

	const getVariantPrice = (key: keyof VariantSelections): number => {
		if (!variations || !selections[key]) return 0;
		
		const maps = {
			materialType: variations.material_types,
			color: variations.colors,
			seatStitchPattern: variations.seat_stitch_patterns,
			reclineType: variations.recline_types,
			lumbarType: variations.lumbar_types,
			heatOption: variations.heat_options,
			seatType: variations.seat_types,
			itemType: variations.item_types,
			seatStyle: variations.seat_styles,
			armType: variations.arm_types,
		};
		
		const list = maps[key] || [];
		const item = list.find((i: any) => i.id == selections[key]);
		return getItemPrice(item);
	};

	const totalPrice = useMemo(() => {
		if (!variations) return basePrice;
		
		const variantPrices = [
			'materialType', 'color', 'seatStitchPattern', 'reclineType', 
			'lumbarType', 'heatOption', 'seatType', 'itemType', 
			'seatStyle', 'armType'
		].reduce((sum, key) => sum + getVariantPrice(key as keyof VariantSelections), 0);
		
		return Math.max(0, basePrice + variantPrices);
	}, [variations, selections, basePrice]);

	const updateSelection = (key: keyof VariantSelections, value: any) => {
		if (readOnly) return;
		setSelections(prev => ({ ...prev, [key]: value }));
		
		if (onPreview) {
			const newSelections = { ...selections, [key]: value };
			const newPrice = basePrice + Object.keys(newSelections).reduce((sum, k) => {
				if (!variations || !newSelections[k as keyof VariantSelections]) return sum;
				const maps = {
					materialType: variations.material_types,
					color: variations.colors,
					seatStitchPattern: variations.seat_stitch_patterns,
					reclineType: variations.recline_types,
					lumbarType: variations.lumbar_types,
					heatOption: variations.heat_options,
					seatType: variations.seat_types,
					itemType: variations.item_types,
					seatStyle: variations.seat_styles,
					armType: variations.arm_types,
				};
				const list = maps[k as keyof typeof maps] || [];
				const item = list.find((i: any) => i.id == newSelections[k as keyof VariantSelections]);
				return sum + (parseFloat(item?.price) || 0);
			}, 0);
			
			onPreview({ selections: newSelections, newUnitPrice: Math.max(0, newPrice) });
		}
	};

	const renderSelect = (key: keyof VariantSelections, label: string, options: any[]) => {
		const price = getVariantPrice(key);
		
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
					<Typography variant="body2">{label}:</Typography>
					{price > 0 && (
						<Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700 }}>
							+${price.toFixed(2)}
						</Typography>
					)}
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
		const price = getVariantPrice('materialType');
		
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Material</Typography>
					{price > 0 && (
						<Chip size="small" label={`+$${price.toFixed(2)}`} sx={{ color: 'error.main' }} />
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
		const price = getVariantPrice('color');
		
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Color</Typography>
					{price > 0 && (
						<Chip size="small" label={`+$${price.toFixed(2)}`} sx={{ color: 'error.main' }} />
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
		const price = getVariantPrice('seatStitchPattern');
		
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Stitching Pattern</Typography>
					{price > 0 && (
						<Chip size="small" label={`+$${price.toFixed(2)}`} sx={{ color: 'error.main' }} />
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
								{renderSelect('armType', 'Arm Type', variations?.arm_types || [])}
							</Box>
						</Box>

						<Divider />
						
						{!readOnly && (
							<>
								<Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
									<Typography variant="subtitle1">New Unit Price</Typography>
									<Chip color="primary" label={`$${totalPrice.toFixed(2)}`} />
								</Box>
								<Box display="flex" justifyContent="flex-end" gap={1}>
									<Button onClick={onClose}>Cancel</Button>
									<Button variant="contained" onClick={() => onApply({ selections, newUnitPrice: totalPrice })}>
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