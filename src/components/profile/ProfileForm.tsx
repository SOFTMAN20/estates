/**
 * ProfileForm.tsx - Profile Form Component
 * ========================================
 * 
 * Editable form fields for profile information
 */

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, MapPin, Home } from 'lucide-react';

interface ProfileFormProps {
  name: string;
  phone: string;
  location: string;
  bio: string;
  isHost: boolean;
  editing: boolean;
  onChange: (field: string, value: string | boolean) => void;
}

export const ProfileForm = ({
  name,
  phone,
  location,
  bio,
  isHost,
  editing,
  onChange
}: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Jina Kamili
        </Label>
        {editing ? (
          <Input
            id="name"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Weka jina lako kamili"
          />
        ) : (
          <p className="text-gray-700 pl-6">{name || 'Haijawekwa'}</p>
        )}
      </div>

      <Separator />

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          Nambari ya Simu
        </Label>
        {editing ? (
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+255712345678"
          />
        ) : (
          <p className="text-gray-700 pl-6">{phone || 'Haijawekwa'}</p>
        )}
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Mahali
        </Label>
        {editing ? (
          <Input
            id="location"
            value={location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="Mfano: Dar es Salaam, Tanzania"
          />
        ) : (
          <p className="text-gray-700 pl-6">{location || 'Haijawekwa'}</p>
        )}
      </div>

      <Separator />

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Maelezo Mafupi
        </Label>
        {editing ? (
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => onChange('bio', e.target.value)}
            placeholder="Eleza kidogo kuhusu wewe..."
            rows={4}
          />
        ) : (
          <p className="text-gray-700 pl-6 whitespace-pre-wrap">
            {bio || 'Haijawekwa'}
          </p>
        )}
      </div>

      <Separator />

      {/* Host Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="is_host" className="flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            Mwenye Nyumba
          </Label>
          <p className="text-sm text-gray-500">
            Washa ili uweze kutangaza nyumba zako
          </p>
        </div>
        {editing ? (
          <Switch
            id="is_host"
            checked={isHost}
            onCheckedChange={(checked) => onChange('is_host', checked)}
          />
        ) : (
          <Badge variant={isHost ? "default" : "secondary"}>
            {isHost ? 'Ndio' : 'Hapana'}
          </Badge>
        )}
      </div>
    </div>
  );
};
