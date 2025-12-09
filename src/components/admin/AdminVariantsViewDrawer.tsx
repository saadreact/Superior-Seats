import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Button, CircularProgress, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
	displayPrice?: number; // For read-only mode: show this price instead of calculating
	onApply: (payload: { selections: VariantSelections; newUnitPrice: number }) => void;
	readOnly?: boolean;
}

const AdminVariantsViewDrawer: React.FC<AdminVariantsDrawerProps> = ({ 
	open, 
	onClose, 
	productId, 
	initialSelections, 
	basePrice = 0,
	displayPrice
}) => {
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
					relaxors: product.relaxors || [],
					item_types: product.item_types || [],
				});
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
				console.error('Failed to load variations', e);
				setError('Failed to load product variations');
			})
			.finally(() => setLoading(false));
	}, [open, productId, initialSelections]);

	const getName = (list: any[], id: string | number | undefined): string => {
		if (!id) return '—';
		const found = (list || []).find((x: any) => String(x.id) === String(id));
		return found?.name || '—';
	};
	const getItem = (list: any[], id: string | number | undefined): any | null => {
		if (!id) return null;
		return (list || []).find((x: any) => String(x.id) === String(id)) || null;
	};

	const totalPrice = useMemo(() => {
		// If displayPrice is provided (read-only mode with saved order), use it directly
		if (displayPrice !== undefined) return displayPrice;
		
		// Otherwise, calculate from basePrice + variants
		if (!variations) return basePrice;
		const lookup: Record<string, any[]> = {
			materialType: variations.material_types || [],
			color: variations.colors || [],
			seatStitchPattern: variations.seat_stitch_patterns || [],
			reclineType: variations.recline_types || [],
			lumbarType: variations.lumbar_types || [],
			heatOption: variations.heat_options || [],
			seatType: variations.seat_types || [],
			itemType: variations.item_types || [],
			seatStyle: variations.seat_styles || [],
			relaxor: variations.relaxors || [],
			armType: variations.arm_types || [],
		};
		const variantsSum = (Object.keys(selections) as (keyof VariantSelections)[]).reduce((sum, key) => {
			// Skip non-priced fields (customization colors don't have prices)
			if (key === 'externalStitchColor' || key === 'pipingColor' || key === 'customizationData') {
				return sum;
			}
			const list = lookup[key] || [];
			const found = list.find((x: any) => String(x.id) === String(selections[key]));
			const price = found ? parseFloat(found.price) || 0 : 0;
			return sum + price;
		}, 0);
		return Math.max(0, basePrice + variantsSum);
	}, [variations, selections, basePrice, displayPrice]);

	const MaterialAppearanceRow = () => {
		const material = getItem(variations?.material_types || [], selections.materialType);
		const color = getItem(variations?.colors || [], selections.color);
		const stitch = getItem(variations?.seat_stitch_patterns || [], selections.seatStitchPattern);
		
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
				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Material & Appearance</Typography>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Typography variant="body2">Material:</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							{material?.image_url ? (
								<Box sx={{ position: 'relative', width: 56, height: 36, borderRadius: 1, border: '1px solid #ddd', overflow: 'hidden' }}>
									<Image src={material.image_url} alt={material.name} fill style={{ objectFit: 'cover' }} />
								</Box>
							) : null}
							<Typography variant="body2" fontWeight={600}>{material?.name || '—'}</Typography>
						</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Typography variant="body2">Color:</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #ddd', bgcolor: color?.hex_code || 'transparent', display: 'inline-block' }} />
							<Typography variant="body2" fontWeight={600}>{color?.name || '—'}</Typography>
						</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Typography variant="body2">Stitch Pattern:</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							{stitch?.image_url ? (
								<Box sx={{ position: 'relative', width: 56, height: 36, borderRadius: 1, border: '1px solid #ddd', overflow: 'hidden' }}>
									<Image src={stitch.image_url} alt={stitch.name} fill style={{ objectFit: 'cover' }} />
								</Box>
							) : null}
							<Typography variant="body2" fontWeight={600}>{stitch?.name || '—'}</Typography>
						</Box>
					</Box>
					{selections.externalStitchColor && (
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<Typography variant="body2">External Stitching Color:</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #ddd', bgcolor: selections.externalStitchColor || 'transparent', display: 'inline-block' }} />
								<Typography variant="body2" fontWeight={600}>
									{getColorName(selections.externalStitchColor)} ({selections.externalStitchColor})
								</Typography>
							</Box>
						</Box>
					)}
					{selections.pipingColor && (
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<Typography variant="body2">Piping Color:</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #ddd', bgcolor: selections.pipingColor || 'transparent', display: 'inline-block' }} />
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
					<Typography variant="h6">Variants (View)</Typography>
					<IconButton onClick={onClose}><CloseIcon /></IconButton>
				</Box>
				<Divider />
				{loading ? (
					<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
				) : error ? (
					<Typography color="error">{error}</Typography>
				) : (
					<Box display="grid" gap={2}>
						<MaterialAppearanceRow />
						<Divider />
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Variation</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Recline:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.recline_types || [], selections.reclineType)}</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Lumbar:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.lumbar_types || [], selections.lumbarType)}</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Heat Option:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.heat_options || [], selections.heatOption)}</Typography>
								</Box>
							</Box>
						</Box>
						<Divider />
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Seat</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Seat Type:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.seat_types || [], selections.seatType)}</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Item Type:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.item_types || [], selections.itemType)}</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Seat Style:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.seat_styles || [], selections.seatStyle)}</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Relaxor:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.relaxors || [], selections.relaxor)}</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Typography variant="body2">Arm Type:</Typography>
									<Typography variant="body2" fontWeight={600}>{getName(variations?.arm_types || [], selections.armType)}</Typography>
								</Box>
							</Box>
						</Box>
						<Divider />
						<Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
							<Typography variant="subtitle1">Unit Price</Typography>
							<Chip color="primary" label={`$${totalPrice.toFixed(2)}`} />
						</Box>
						<Box display="flex" justifyContent="flex-end">
							<Button variant="contained" onClick={onClose}>Close</Button>
						</Box>
					</Box>
				)}
			</Box>
		</Drawer>
	);
};

export default AdminVariantsViewDrawer; 