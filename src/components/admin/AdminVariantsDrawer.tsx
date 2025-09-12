import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, FormControl, Select, MenuItem, Button, CircularProgress, Chip, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { CustomizedSeatApi } from '@/services/CustomizedSeatApi';
import { vehicleMakes } from '@/data/CustomizedSeat';
import Image from 'next/image';

export interface VariantSelections {
	materialType?: string;
	color?: string;
	seatStitchPattern?: string;
	reclineType?: string;
	lumbarType?: string;
	heatOption?: string;
	seatType?: string;
	itemType?: string;
	seatStyle?: string;
	armType?: string;
	vehicle_make?: string;
	vehicle_model?: string;
	vehicle_trim?: string;
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

const AdminVariantsDrawer: React.FC<AdminVariantsDrawerProps> = ({ open, onClose, productId, initialSelections, basePrice = 0, onApply, onPreview, readOnly }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [variations, setVariations] = useState<any>(null);

	const [selections, setSelections] = useState<VariantSelections>({});

	useEffect(() => {
		// Normalize any incoming snake_case keys to camelCase for compatibility
		const s: any = initialSelections || {};
		const normalized: VariantSelections = {
			materialType: s.materialType ?? s.material_type ?? selections.materialType,
			color: s.color ?? selections.color,
			seatStitchPattern: s.seatStitchPattern ?? s.seat_stitch_pattern ?? selections.seatStitchPattern,
			reclineType: s.reclineType ?? s.recline_type ?? selections.reclineType,
			lumbarType: s.lumbarType ?? s.lumbar_type ?? selections.lumbarType,
			heatOption: s.heatOption ?? s.heat_option ?? selections.heatOption,
			seatType: s.seatType ?? s.seat_type ?? selections.seatType,
			itemType: s.itemType ?? s.item_type ?? selections.itemType,
			seatStyle: s.seatStyle ?? s.seat_style ?? selections.seatStyle,
			armType: s.armType ?? s.arm_type ?? selections.armType,
			// Vehicle fields stay as provided
			vehicle_make: s.vehicle_make ?? selections.vehicle_make,
			vehicle_model: s.vehicle_model ?? selections.vehicle_model,
			vehicle_trim: s.vehicle_trim ?? selections.vehicle_trim,
		};
		setSelections(normalized);
	}, [initialSelections]);

	useEffect(() => {
		if (!open || !productId) return;
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const p = await CustomizedSeatApi.getProductById(productId);
				setVariations({
					colors: p.colors || [],
					material_types: p.material_types || [],
					heat_options: p.heat_options || [],
					lumbar_types: p.lumbar_types || [],
					recline_types: p.recline_types || [],
					seat_stitch_patterns: p.seat_stitch_patterns || [],
					arm_types: p.arm_types || [],
					seat_types: p.seat_types || [],
					seat_styles: p.seat_styles || [],
					item_types: p.item_types || [],
					vehicle_trim: p.vehicle_trim ? [p.vehicle_trim] : [],
				});
			} catch (e: any) {
				console.error('Variants load failed', e);
				setError('Failed to load product variations');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [open, productId]);

	const toNumber = (v: any) => {
		if (v === null || v === undefined) return 0;
		const n = typeof v === 'string' ? parseFloat(v) : Number(v);
		return isNaN(n) ? 0 : n;
	};

	const getPriceFromTiersOrPrice = (item: any): number => {
		if (!item) return 0;
		const tiers = item.price_tiers || [];
		let adjust = 0;
		if (Array.isArray(tiers) && tiers.length > 0) {
			const retail = tiers.find((t: any) => t.name === 'retail_price');
			const fallback = tiers.find((t: any) => t.pivot?.price_adjustment);
			adjust = toNumber(retail?.pivot?.price_adjustment ?? fallback?.pivot?.price_adjustment);
		}
		if (adjust !== 0) return adjust;
		// fallback to item.price when tiers do not provide adjustment
		return toNumber(item.price);
	};

	const addedPrice = (key: keyof VariantSelections) => {
		if (!variations) return 0;
		const id = selections[key];
		if (!id) return 0;
		const map: Record<string, any[]> = {
			materialType: variations.material_types || [],
			color: variations.colors || [],
			seatStitchPattern: variations.seat_stitch_patterns || [],
			reclineType: variations.recline_types || [],
			lumbarType: variations.lumbar_types || [],
			heatOption: variations.heat_options || [],
			seatType: variations.seat_types || [],
			itemType: variations.item_types || [],
			seatStyle: variations.seat_styles || [],
			armType: variations.arm_types || [],
			vehicle_make: [],
			vehicle_model: [],
			vehicle_trim: variations.vehicle_trim || [],
		};
		const list = map[key as string] || [];
		const obj = list.find((o: any) => String(o.id) === String(id));
		return getPriceFromTiersOrPrice(obj);
	};

	const computedPrice = useMemo(() => {
		if (!variations) return basePrice || 0;
		const add = (
			addedPrice('materialType') +
			addedPrice('color') +
			addedPrice('seatStitchPattern') +
			addedPrice('reclineType') +
			addedPrice('lumbarType') +
			addedPrice('heatOption') +
			addedPrice('seatType') +
			addedPrice('itemType') +
			addedPrice('seatStyle') +
			addedPrice('armType')
		);
		return Math.max(0, (basePrice || 0) + add);
	}, [variations, selections, basePrice]);

	useEffect(() => {
		if (onPreview) onPreview({ selections, newUnitPrice: computedPrice });
	}, [selections, computedPrice, onPreview]);

	const renderSelectWithDelta = (key: keyof VariantSelections, label: string, list: any[]) => {
		const delta = addedPrice(key);
		const disabled = !!readOnly;
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
					<Typography variant="body2">{label}:</Typography>
					{delta > 0 && (
						<Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700 }}>+${delta.toFixed(2)}</Typography>
					)}
				</Box>
				<FormControl fullWidth disabled={disabled}>
					<Select value={(selections[key] as any) || ''} displayEmpty onChange={(e) => {
						if (disabled) return;
						setSelections(s => ({ ...s, [key]: String(e.target.value) }));
					}}>
						<MenuItem value=""><em>{label}</em></MenuItem>
						{list?.map((opt: any) => (
							<MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
		);
	};

	const smallChip = (txt: string) => (
		<Chip size="small" label={txt} sx={{ ml: 1, fontWeight: 600, bgcolor: 'transparent', color: 'error.main' }} />
	);

	const renderMaterialGrid = () => {
		const delta = addedPrice('materialType');
		const disabled = !!readOnly;
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Material</Typography>
					{delta > 0 && smallChip(`+$${delta.toFixed(2)}`)}
				</Box>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(5, 1fr)' }, gap: 1 }}>
					<Tooltip title="None">
						<Box onClick={() => { if (disabled) return; setSelections(s => ({ ...s, materialType: '' })); }} sx={{ position: 'relative', height: 64, borderRadius: 1, border: '1px dashed #bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', bgcolor: '#fafafa' }}>
							<Typography variant="caption" color="text.secondary">None</Typography>
							{!selections.materialType && <CheckCircle sx={{ position: 'absolute', top: 6, right: 6, color: '#d32f2f' }} />}
						</Box>
					</Tooltip>
					{(variations?.material_types || []).map((m: any) => {
						const selected = String(selections.materialType) === String(m.id);
						return (
							<Tooltip key={m.id} title={m.name}>
								<Box onClick={() => { if (disabled) return; setSelections(s => ({ ...s, materialType: String(m.id) })); }} sx={{ position: 'relative', height: 64, borderRadius: 1, border: selected ? '2px solid #d32f2f' : '1px solid #ddd', overflow: 'hidden', cursor: disabled ? 'not-allowed' : 'pointer' }}>
									{m.image_url ? (
										<Image src={m.image_url} alt={m.name} fill style={{ objectFit: 'cover' }} />
									) : (
										<Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
											<Typography variant="caption" color="text.secondary">{m.name}</Typography>
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
		const delta = addedPrice('color');
		const disabled = !!readOnly;
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Color</Typography>
					{delta > 0 && smallChip(`+$${delta.toFixed(2)}`)}
				</Box>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					<Tooltip title="None">
						<Box onClick={() => { if (disabled) return; setSelections(s => ({ ...s, color: '' })); }} sx={{ width: 36, height: 36, borderRadius: '50%', border: '1px dashed #bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', bgcolor: '#fafafa' }}>
							<Typography variant="caption" color="text.secondary">—</Typography>
						</Box>
					</Tooltip>
					{(variations?.colors || []).map((c: any) => {
						const selected = String(selections.color) === String(c.id);
						return (
							<Tooltip key={c.id} title={c.name}>
								<Box onClick={() => { if (disabled) return; setSelections(s => ({ ...s, color: String(c.id) })); }} sx={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', border: selected ? '2px solid #d32f2f' : '1px solid #ddd', cursor: disabled ? 'not-allowed' : 'pointer', bgcolor: c.hex_code || '#ccc' }} />
							</Tooltip>
						);
					})}
				</Box>
			</Box>
		);
	};

	const renderStitchingGrid = () => {
		const delta = addedPrice('seatStitchPattern');
		const disabled = !!readOnly;
		return (
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Choose Your Stitching Pattern</Typography>
					{delta > 0 && smallChip(`+$${delta.toFixed(2)}`)}
				</Box>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1 }}>
					<Tooltip title="None">
						<Box onClick={() => { if (disabled) return; setSelections(s => ({ ...s, seatStitchPattern: '' })); }} sx={{ position: 'relative', height: 64, borderRadius: 1, border: '1px dashed #bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', bgcolor: '#fafafa' }}>
							<Typography variant="caption" color="text.secondary">None</Typography>
						</Box>
					</Tooltip>
					{(variations?.seat_stitch_patterns || []).map((s: any) => {
						const selected = String(selections.seatStitchPattern) === String(s.id);
						return (
							<Tooltip key={s.id} title={s.name}>
								<Box onClick={() => { if (disabled) return; setSelections(st => ({ ...st, seatStitchPattern: String(s.id) })); }} sx={{ position: 'relative', height: 64, borderRadius: 1, border: selected ? '2px solid #d32f2f' : '1px solid #ddd', overflow: 'hidden', cursor: disabled ? 'not-allowed' : 'pointer' }}>
									{s.image_url ? (
										<Image src={s.image_url} alt={s.name} fill style={{ objectFit: 'cover' }} />
									) : (
										<Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
											<Typography variant="caption" color="text.secondary">{s.name}</Typography>
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
					<Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
				) : error ? (
					<Typography color="error">{error}</Typography>
				) : (
					<Box display="grid" gap={2}>

						{renderMaterialGrid()}
						{renderColorGrid()}
						{renderStitchingGrid()}

						<Divider />

						{/* Variation */}
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Variation</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
								{renderSelectWithDelta('reclineType', 'Recline', variations?.recline_types || [])}
								{renderSelectWithDelta('lumbarType', 'Lumber', variations?.lumbar_types || [])}
								{renderSelectWithDelta('heatOption', 'Heating and Cooling', variations?.heat_options || [])}
							</Box>
						</Box>

						<Divider />

						{/* Seat */}
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Seat</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
								{renderSelectWithDelta('seatType', 'Seat Type', variations?.seat_types || [])}
								{renderSelectWithDelta('itemType', 'Item Type', variations?.item_types || [])}
								{renderSelectWithDelta('seatStyle', 'Seat Style', variations?.seat_styles || [])}
								{renderSelectWithDelta('materialType', 'Material Type', variations?.material_types || [])}
								{renderSelectWithDelta('armType', 'Included Arm', variations?.arm_types || [])}
							</Box>
						</Box>

						<Divider />
						{!readOnly && (
							<>
								<Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
									<Typography variant="subtitle1">New Unit Price</Typography>
									<Chip color="primary" label={`$${computedPrice.toFixed(2)}`} />
								</Box>
								<Box display="flex" justifyContent="flex-end" gap={1}>
									<Button onClick={onClose}>Cancel</Button>
									<Button variant="contained" onClick={() => onApply({ selections, newUnitPrice: computedPrice })}>Apply</Button>
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