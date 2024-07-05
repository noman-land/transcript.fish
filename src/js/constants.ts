import { Host } from './types';

export const PAGE_SIZE = 10;

export const hosts: { [k in Host]: number } = {
  dan: 12,
  james: 22,
  anna: 7,
  andy: 6,
};

export const Colors = {
  vom: '#6a6015',
  citrineDark: '#baa739',
  citrineDim: '#d2bb3d',
  citrine: '#e8d22f',
  citrineLight: '#f8e44f',
  citrineLighter: '#efe284',
  cirtineWhite: '#fff189',
  dimGrey: '#706563',
  slateGrey: '#748386',
  lightBlue: '#B1D2D3',
  lighterBlue: '#DBE6E6',
  lightPurple: 'rgb(207, 177, 211)',
  lightGreen: '#65d665',
  night: '#090a0b',
  white: '#ffffff',
  dimWhite: '#eeeeee',
};
