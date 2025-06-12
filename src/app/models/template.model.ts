export interface Template {
    id: string;
    name: string;
    imagePath: string;
    thumbnail: string;
    width: number;
    height: number;
    textAreas: TextArea[];
    description?: string;
  }
  
  export interface TextArea {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    fontWeight: 'normal' | 'bold';
    defaultText: string;
    isDraggable: boolean;
    isResizable: boolean;
  }