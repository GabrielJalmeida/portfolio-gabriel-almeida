# V6 QA Notes

- HTML parsed successfully.
- No duplicate IDs found in the user-facing page.
- JavaScript passes `node --check`.
- Portrait asset is local WebP.
- English and PT-BR CV download targets exist locally.
- Contact section has desktop/tablet/mobile CSS compositions.
- Legacy orbit markup was removed from the user-facing page.

Browser screenshot automation was not relied on for this pass because the available headless Chromium instance timed out in the runtime; the changes are therefore packaged as a layout/code revision with structural validation.
