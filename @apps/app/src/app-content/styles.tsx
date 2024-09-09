import "./index.scss";
import "./TranslationContentCard.scss";

import { Atom, StoreSubject } from "@espoojs/atom";

export const StyleContextAtom = Atom.of(
  { key: "styleContextAtom" },
  new StoreSubject({
    styleContextAtom: {} as Record<string, string>,
  })
);

(async () => {
  if(!__DEV__) {
    const ContentStyle = (await import('./index.scss?inline')).default;
    const TranslationContentCardStyle = (await import('./TranslationContentCard.scss?inline')).default;

    StyleContextAtom.set$({ContentStyle, TranslationContentCardStyle});
  }
})()
