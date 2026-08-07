export const AUTHOR_PROJECTION = `
  "author": {
    "name": coalesce(authorProfile->name, author, "Warren Team"),
    "image": authorProfile->image,
    "slug": coalesce(authorProfile->slug.current, lower(author), "unknown-author")
  }
`;
