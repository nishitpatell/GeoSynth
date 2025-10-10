/**
 * Country Card Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatNumber, formatArea } from '@/shared/utils';
import { generateRoute } from '@/shared/constants';

export const CountryCard = ({ country }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(generateRoute.countryProfile(country.code));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={country.flag} 
              alt={`${country.name} flag`}
              className="w-12 h-8 object-cover rounded"
            />
            <CardTitle className="text-lg">{country.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Capital:</dt>
            <dd className="font-medium">{country.capital}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Population:</dt>
            <dd className="font-medium">{formatNumber(country.population)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Region:</dt>
            <dd className="font-medium">{country.region}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Area:</dt>
            <dd className="font-medium">{formatArea(country.area)}</dd>
          </div>
        </dl>
        <Button className="w-full mt-4" size="sm">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
