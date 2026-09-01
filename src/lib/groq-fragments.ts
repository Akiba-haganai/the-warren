export const AUTHOR_PROJECTION = `
  "author": {
    "name": coalesce(authorProfile->name, author, "WEAVE Team"),
    "image": authorProfile->image,
    "slug": coalesce(authorProfile->slug.current, lower(author), "unknown-author")
  }
`;
