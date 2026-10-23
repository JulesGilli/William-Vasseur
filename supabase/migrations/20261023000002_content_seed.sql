-- The content as it stood in the code when editing moved to the database,
-- word for word. From here on the database is the source and the code only
-- renders it. Media keep their repository paths (leading "/").

insert into public.projects
  (id, ref, title, category, year, software, description, spec, poster, model, renders, stages, position)
values
(
  'mossy-log', 'PRJ—001', 'Bloom Fragment', 'Nature', '2026', 'Blender',
  $t$A drifting shard of bark, moss and quartz in bloom. The study that set the direction for everything since — technology used to look at nature closely.$t$,
  'GLB · 25K TRIS', '/models/posters/mossy-log.webp', '/models/mossy-log.glb',
  '[]', '[]', 0
),
(
  'navana', 'PRJ—002', 'Navana', 'Nature', '2026', 'Blender · Cycles',
  $t$A canopy of fused mushroom crowns closing over a still pool. Built for the light: everything in the scene exists to catch the shafts coming through the gaps.$t$,
  'Still · 1920 × 1080', '/process/render.webp', null,
  $j$[
    {"src": "/gallery/navana-landscape.webp", "label": "Landscape", "size": "1920 × 1080"}
  ]$j$,
  $j$[
    {"index": "01", "label": "Drawing", "tool": "Pen · perspective sketch",
     "caption": "It starts on paper. Perspective lines, the arch of the canopy and where the eye should land — the whole scene decided in pen before any of it is worth building.",
     "image": "/process/drawing.webp"},
    {"index": "02", "label": "Concept", "tool": "Painted study",
     "caption": "A painted study next — the mood, the scale of the canopy and the palette get settled before a single vertex exists.",
     "image": "/process/concept.webp"},
    {"index": "03", "label": "Blockout", "tool": "Blender · solid view",
     "caption": "Geometry only. Trunks, ground scatter and silhouettes are built and dressed in flat colour, so the composition can be judged without lighting hiding anything.",
     "image": "/process/blockout.webp"},
    {"index": "04", "label": "Render", "tool": "Blender · Cycles",
     "caption": "Materials, volumetric light through the canopy, then a grade. Same camera as the blockout, so the two can be read against each other.",
     "image": "/process/render.webp"}
  ]$j$,
  1
),
(
  'navana-desert', 'PRJ—003', 'Navana / Desert', 'Nature', '2026', 'Blender · Cycles',
  $t$The dry side of the same world. Ribbon trunks arc over red rock and shallow pools, with a second planet sitting low behind the ridge.$t$,
  'Still · 1080 × 1920', '/process/desert-render.webp', null,
  $j$[
    {"src": "/gallery/desert-portrait.webp", "label": "Portrait", "size": "1080 × 1920"}
  ]$j$,
  $j$[
    {"index": "01", "label": "Clown pass", "tool": "Blender · random colour",
     "caption": "Every asset gets its own flat colour. Nothing to do with the final look — it is there to check that each element still reads as separate once they overlap.",
     "image": "/process/desert-clown.webp"},
    {"index": "02", "label": "Render", "tool": "Blender · Cycles",
     "caption": "Shaded, lit and graded from the same camera, so the two passes can be read against each other.",
     "image": "/process/desert-render.webp"}
  ]$j$,
  2
);

insert into public.site_content (key, value) values
('hero', $j${
  "tagline": "3D Artist — science-fiction environments, characters and the objects they leave behind.",
  "location": "Toulouse, France",
  "piece": {
    "title": "Couronne",
    "spec": "GLB · 16K TRIS",
    "model": "/models/couronne.glb",
    "poster": "/models/posters/couronne.webp"
  }
}$j$),
('band', $j${
  "words": ["SCIENCE FICTION", "NATURE", "REAL-TIME", "RESIN PRINTS", "DIORAMAS", "ENVIRONMENTS", "CHARACTERS"]
}$j$),
('about', $j${
  "title": "ABOUT ME",
  "portrait": "/portrait.webp",
  "portraitLabel": "July 2026 — Picture_of_me.png",
  "paragraphs": [
    "Hello, I'm a 3D artist from Toulouse, in France. I'm 25 and I've been making things for as long as I can remember. I came to 3D about five years ago through a love of new tools, and I've been pushing at its edges ever since — in medium as much as in subject.",
    "Welcome to my world: equal parts technology and nature. I build science fiction, then print it, frame it and put it on a shelf."
  ],
  "stats": [
    {"term": "Based in", "value": "Toulouse, FR"},
    {"term": "Experience", "value": "5 years"},
    {"term": "Focus", "value": "Sci-fi / Nature"}
  ]
}$j$),
('tools', $j${
  "title": "CREATING 3D, WITH DIFFERENT TOOLS",
  "intro": "I learned 3D in Blender and still open it every day. Around it sit Unreal Engine for real-time lighting, DaVinci Resolve for grading, and Nomad Sculpt on the tablet when a shape needs hands.",
  "tools": [
    {"name": "Blender", "role": "Modeling · Shading · Render", "icon": "blender"},
    {"name": "Unreal Engine", "role": "Real-time · Lighting", "icon": "unreal"},
    {"name": "DaVinci Resolve", "role": "Grading · Edit", "icon": "resolve"},
    {"name": "Nomad Sculpt", "role": "Sculpting · Tablet", "icon": "nomad"}
  ]
}$j$),
('process', $j${
  "title": "FROM A SKETCH TO A WORLD",
  "project": "Navana · 2026",
  "stages": [
    {"label": "Drawing", "tool": "Pen · perspective sketch",
     "caption": "It starts on paper. Perspective lines, the arch of the canopy and where the eye should land — the whole scene decided in pen before any of it is worth building. Scroll to watch it drawn.",
     "image": "/process/drawing.webp", "video": "/process/drawing-timelapse.mp4"},
    {"label": "Concept", "tool": "Painted study",
     "caption": "A painted study next — the mood, the scale of the canopy, and the palette get settled before a single vertex exists.",
     "image": "/process/concept.webp"},
    {"label": "Blockout", "tool": "Blender · solid view",
     "caption": "Geometry only. Trunks, ground scatter and silhouettes are built and dressed in flat colour, so the composition can be judged without lighting hiding anything.",
     "image": "/process/blockout.webp"},
    {"label": "Render", "tool": "Blender · Cycles",
     "caption": "Materials, volumetric light through the canopy, then a grade. Same camera as the blockout, so the two can be read against each other.",
     "image": "/process/render.webp"}
  ]
}$j$),
('physical', $j${
  "title": "PUT MY IMAGINATION IN THE REAL LIFE",
  "intro": "Once an environment or a character is finished, I bring it out of the screen — printed on paper as posters, and run through a resin printer for models and dioramas."
}$j$),
('cta', $j${
  "title": "FOLLOW ME, I WILL SHOW YOU",
  "text": "New work turns up whenever the inspiration does. Every piece below can be turned around in your browser — no render, the actual mesh.",
  "button": "MY PROJECTS"
}$j$),
('contact', $j${
  "email": "contact@williamvasseur.fr",
  "artstation": "https://www.artstation.com/williamvasseur",
  "instagram": "https://www.instagram.com/v2s3d/"
}$j$);
