export type MediaMetadata = {
  streams?: Stream[];
  format?: Format;
};

export type Format = {
  filename?: string;
  nb_streams?: number;
  nb_programs?: number;
  nb_stream_groups?: number;
  format_name?: string;
  format_long_name?: string;
  start_time?: string;
  duration?: string;
  size?: string;
  bit_rate?: string;
  probe_score?: number;
  tags?: FormatTags;
};

export type FormatTags = {
  title?: string;
  encoder?: string;
  creation_time?: Date;
};

export type Stream = {
  index?: number;
  codec_name?: string;
  codec_long_name?: string;
  profile?: string;
  codec_type?: string;
  codec_tag_string?: string;
  codec_tag?: string;
  width?: number;
  height?: number;
  coded_width?: number;
  coded_height?: number;
  closed_captions?: number;
  film_grain?: number;
  has_b_frames?: number;
  sample_aspect_ratio?: string;
  display_aspect_ratio?: string;
  pix_fmt?: string;
  level?: number;
  color_range?: string;
  chroma_location?: string;
  refs?: number;
  view_ids_available?: string;
  view_pos_available?: string;
  r_frame_rate?: string;
  avg_frame_rate?: string;
  time_base?: string;
  start_pts?: number;
  start_time?: string;
  extradata_size?: number;
  disposition?: { [key: string]: number };
  tags?: StreamTags;
  sample_fmt?: string;
  sample_rate?: string;
  channels?: number;
  channel_layout?: string;
  bits_per_sample?: number;
  initial_padding?: number;
  bits_per_raw_sample?: string;
  bit_rate?: string;
  duration_ts?: number;
  duration?: string;
};

export type StreamTags = {
  language?: string;
  title?: string;
  BPS?: string;
  DURATION?: string;
  NUMBER_OF_FRAMES?: string;
  NUMBER_OF_BYTES?: string;
  _STATISTICS_WRITING_APP?: string;
  _STATISTICS_WRITING_DATE_UTC?: Date;
  _STATISTICS_TAGS?: string;
};

export type IntermediateMetadata = {
  title: string;
  releaseYear?: string;
  videoFormat?: string;
  audioFormat?: string;
  season?: string;
  episode?: string;
  episodeFullMatch?: string;
  category: 'MOVIE' | 'TV';
  fileName: string;
};
