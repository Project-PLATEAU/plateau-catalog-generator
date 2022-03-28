export interface TerriaLegendItem {
  title?: string;
  maxMultipleTitlesShowed?: number;
  titleAbove?: string;
  titleBelow?: string;
  color?: string;
  outlineColor?: string;
  imageUrl?: string;
  addSpacingAbove?: boolean;
  imageHeight?: number;
  imageWidth?: number;
}

export interface TerriaLegend {
  title?: string;
  url?: string;
  imageScaling?: number;
  urlMimeType?: string;
  items?: TerriaLegendItem[];
}

export interface TerriaRectangle {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface TerriaFeatureInfoTemplate {
  template: string;
}

export interface TerriaShortReportSection {
  name: string;
  content: string;
  show?: boolean;
}

export interface TerriaCatalogItem {
  type: string;
  name?: string;
  id: string;
  rectangle?: TerriaRectangle;
  featureInfoTemplate?: TerriaFeatureInfoTemplate;
  shortReportSections?: TerriaShortReportSection[];
  legends?: TerriaLegend[];
  [_: string]: unknown;
}

export interface TerriaCatalogGroup extends TerriaCatalogItem {
  type: "group";
  members: TerriaCatalogItem[];
}

export interface TerriaCompositeCatalogItem extends TerriaCatalogItem {
  type: "composite";
  members: TerriaCatalogItem[];
}

export type TerriaCompositeOrGroup =
  | TerriaCatalogGroup
  | TerriaCompositeCatalogItem;

export interface TerriaBaseMap {
  item: TerriaCatalogItem;
  image: string;
}

export interface TerriaHomeCamera {
  west: number;
  south: number;
  east: number;
  north: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  direction: {
    x: number;
    y: number;
    z: number;
  };
  up: {
    x: number;
    y: number;
    z: number;
  };
}

export interface TerriaInit {
  corsDomains?: string[];
  homeCamera?: TerriaHomeCamera;
  baseMaps?: TerriaBaseMap[];
  catalog: TerriaCatalogItem[];
}
