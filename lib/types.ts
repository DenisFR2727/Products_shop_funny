// Types Api

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}
interface Reviews {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface IProducts {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  weight: number;
  dimensions?: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews?: Reviews[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta?: Meta;
  images: string;
  thumbnail: string;
  amount: number;
}
export interface IProductsResponse {
  products: IProducts[];
  total: number;
  skip: number;
  limit: number;
}
// --------------------------------------------
// UnsPlash types

export interface Urls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}
export interface Links {
  self: string;
  html: string;
  download: string;
  download_location: string;
}
export interface Profile_image {
  small: string;
  medium: string;
  large: string;
}
export interface Social {
  instagram_username: string;
  portfolio_url: string;
  twitter_username?: string | null;
  paypal_email?: string | null;
}
export interface UnsPlash {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  promoted_at: string;
  width: number;
  height: number;
  alt_description: string;
  urls: Urls;
  links: Links;
  user: {
    profile_image: Profile_image;
    social: Social;
  };
}
