# V8 QA Notes

## Structural checks
- JavaScript passes `node --check`.
- HTML parsed successfully.
- No duplicate IDs detected.
- No broken internal hash anchors detected.
- Local CSS and JavaScript assets exist.
- Portrait asset exists locally as WebP.
- English and PT-BR CV files exist locally.

## Narrative checks
- old “Building depth, not collecting tools.” copy removed.
- old generic five-step How I Work replaced by three evidence-linked steps.
- AI-assisted workflow disclosure added discreetly.
- career path and Learning Now added to About.
- CV quick access added to primary navigation.
- location surfaced in Hero.

## Existing mobile QA retained from V7
- mobile hero typography polish
- Selected Work Lumina preview recomposition
- compact two-column Lumina architecture interaction
- Ponto Comum accessibility controls in 2×2 layout
- Inventory title-specific scaling

The available headless Chromium process timed out in this runtime, so this pass relies on structural validation plus the previously tested V7 mobile foundation. Physical-device review remains recommended after deployment.
