import tw, { css } from 'twin.macro';

export const stylesBase = css`
  .light {
    --bg-primary: #F1F5F9;
    --bg-secondary: #F8FAFC;
    --bg-tertiary: #E2E8F0;
    --bg-quaternary: #64748B;
    --text-primary: #1E293B;
    --text-secondary: #64748B;
    --text-tertiary: #F8FAFC;
    --border-secondary: #64748B;

  }
  .dark {
    --bg-primary: #1E293B;
    --bg-secondary: #334155;
    --bg-tertiary: #64748B;
    --bg-quaternary: #94A3B8;
    --text-primary: #94A3B8;
    --text-secondary: #94A3B8;
    --text-tertiary: #94A3B8;
    --border-secondary: #64748B;

  }
`;
