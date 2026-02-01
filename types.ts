
export interface ServiceCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  badge: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
  score: number;
}

export interface WorkItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  span?: string;
}

export interface Testimonial {
  rating: number;
  text: string;
  author: string;
  role: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
