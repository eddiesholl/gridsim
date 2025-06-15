type ContentItem = {
  key: string;
  title: string;
  content: React.ReactNode;
};

export type ResponsiveContentProps = {
  title: string;
  text: string[];
  content: ContentItem[];
};
