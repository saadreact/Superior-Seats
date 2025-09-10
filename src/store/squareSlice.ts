import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SquareState {
	connected: boolean;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
	merchantId?: string;
	locationId?: string;
	environment?: 'sandbox' | 'production';
}

const initialState: SquareState = {
	connected: false,
	environment: (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT as any) || 'sandbox',
};

const squareSlice = createSlice({
	name: 'square',
	initialState,
	reducers: {
		setConnected(state, action: PayloadAction<Partial<SquareState>>) {
			state.connected = action.payload.connected ?? state.connected;
			state.accessToken = action.payload.accessToken ?? state.accessToken;
			state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
			state.expiresAt = action.payload.expiresAt ?? state.expiresAt;
			state.merchantId = action.payload.merchantId ?? state.merchantId;
			state.locationId = action.payload.locationId ?? state.locationId;
			state.environment = (action.payload.environment as any) ?? state.environment;
		},
		clearSquare(state) {
			state.connected = false;
			state.accessToken = undefined;
			state.refreshToken = undefined;
			state.expiresAt = undefined;
			state.merchantId = undefined;
			state.locationId = undefined;
		},
	},
});

export const { setConnected, clearSquare } = squareSlice.actions;
export default squareSlice.reducer; 