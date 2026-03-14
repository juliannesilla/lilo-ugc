export interface GeminiResponse {
  text: string;
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  STANDARD = '4:3',
  WIDE = '21:9',
  THREE_FOUR = '3:4',
  TWO_THREE = '2:3',
  THREE_TWO = '3:2'
}

export enum ImageResolution {
  ONE_K = '1K',
  TWO_K = '2K',
  FOUR_K = '4K'
}

export interface CopyRatingItem {
  section: string;
  rating: number;
  reason: string;
  improvement: string;
}

export interface Testimonial {
  id: number;
  text: string;
  client: string;
  role: string;
}

export interface Package {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}