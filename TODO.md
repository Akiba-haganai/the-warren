# TODO: Debug theme changing

- [ ] Create root cause hypothesis based on code: theme toggle adds/removes `dark` class on `document.documentElement`
- [ ] Inspect `src/index.css` for dark-mode variable overrides completeness
- [ ] Fix `src/index.css` so `.dark` overrides all Shadcn variables used by `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.
- [ ] Ensure header switch uses correct `Switch` API (checked/onCheckedChange) and `dark` state stays in sync
- [ ] Add persistence for theme (optional): localStorage + initial load
- [ ] Run build/dev to verify theme switching

