// global types

interface Window {
	__SHOPIFY_CUSTOMER__?: {
		id?: string | number;
		firstName?: string;
	} | null;
	__HOM_CONSENT__?: {
		analytics: boolean;
		marketing: boolean;
		updatedAt: string;
	} | null;
	__WISHLIST_API_BASE__?: string;
}
