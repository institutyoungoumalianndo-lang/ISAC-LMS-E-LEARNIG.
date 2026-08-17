import {
  BookOpen, ClipboardList, UserCheck, Cpu, Crown, TrendingUp, Calculator,
  GraduationCap, Users, Star, Clock, ArrowRight, Mail, Phone, MapPin,
  Facebook, Twitter, Linkedin, Instagram, type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<LucideProps>> = {
  BookOpen,
  ClipboardList,
  UserCheck,
  Cpu,
  Crown,
  TrendingUp,
  Calculator,
  GraduationCap,
  Users,
  Star,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
};

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = iconMap[name] || BookOpen;
  return <Icon {...props} />;
}
