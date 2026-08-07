import { asset } from '../lib/asset';

export interface Project {
  id: string;
  ref: string;
  title: string;
  category: string;
  year: string;
  software: string;
  description: string;
  image: string;
}

export const projects: Project[] = [
{
  id: 'station',
  ref: 'PRJ—001',
  title: 'Sector 4 / Biology',
  category: 'Environment',
  year: '2026',
  software: 'Blender · Unreal Engine',
  description:
  'An abandoned orbital research corridor, slowly reclaimed by the biology it was built to contain.',
  image: asset("/0b2a7de3-c2b1-4bf2-ae5d-7e0fc06656d2.jpg")

},
{
  id: 'walker',
  ref: 'PRJ—002',
  title: 'The Last Surveyor',
  category: 'Character',
  year: '2026',
  software: 'Blender · Nomad Sculpt',
  description:
  'A lone explorer in a weathered exosuit, designed for long solitary walks across dead atmospheres.',
  image: asset("/a9bfb9c5-643f-45a8-ad95-5a9f0eadd999.jpg")

},
{
  id: 'forest',
  ref: 'PRJ—003',
  title: 'Pale Canopy',
  category: 'Environment',
  year: '2025',
  software: 'Blender · DaVinci Resolve',
  description:
  'An alien forest growing through the bones of a forgotten structure. Study on fog and scale.',
  image: asset("/6c4b448b-3401-443e-998e-0a989c5b3878.jpg")

},
{
  id: 'vessel',
  ref: 'PRJ—004',
  title: 'Cargo Hauler / DUSK',
  category: 'Hard surface',
  year: '2025',
  software: 'Blender · Fusion',
  description:
  'A derelict cargo vessel drifting above the plain. Hull panelling and weathering exercise.',
  image: asset("/aa821a9f-d626-40d2-b281-5cf11342588d.jpg")

},
{
  id: 'artifact',
  ref: 'PRJ—005',
  title: 'Monolith Study',
  category: 'Prop',
  year: '2025',
  software: 'Blender',
  description:
  'A carved artifact suspended in orbit with its own debris. Lighting and material research.',
  image: asset("/62b617a6-053d-4ff3-9ea9-1994086dbaf0.jpg")

},
{
  id: 'island',
  ref: 'PRJ—006',
  title: 'Bloom Fragment',
  category: 'Environment',
  year: '2026',
  software: 'Blender',
  description:
  'A floating fragment of rock, moss and blossom. The starting point of the whole series.',
  image: asset("/c5091bcf-b0b6-4779-8747-7613c0e9be91.jpg")

}];