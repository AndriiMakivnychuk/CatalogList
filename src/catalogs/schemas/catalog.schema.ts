import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatalogDocument = Catalog & Document;

@Schema()
export class Catalog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['fashion', 'home', 'general'] })
  vertical: string;

  @Prop({ required: true, default: false })
  primary: boolean;

  @Prop({ type: [String], required: true })
  locales: string[];

  @Prop({ required: true, default: false })
  isMultilocale: boolean;
}

export const CatalogSchema = SchemaFactory.createForClass(Catalog);