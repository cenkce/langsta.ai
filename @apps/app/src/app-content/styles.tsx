import "./index.scss";
import "./TranslationContentCard.scss";

import { Atom, StoreSubject } from "@helsinki/atom";

export const StyleContextAtom = Atom.of(
  { key: "styleContextAtom" },
  new StoreSubject({
    styleContextAtom: {} as Record<string, string>,
  })
);

(async () => {
  if(!__DEV__) {
    const ContentStyle: any = (await import('./index.scss?inline')).default;
    const TranslationContentCardStyle: any = (await import('./TranslationContentCard.scss?inline')).default;

    StyleContextAtom.set$({ContentStyle, TranslationContentCardStyle});
  }
})()
