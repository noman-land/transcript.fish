import { Venue } from '../types';

export const formatVenueName = (venue: Venue) => {
  return `${venue.name} (${[venue.region, venue.city, venue.state]
    .filter(n => n)
    .join(', ')})`;
};
