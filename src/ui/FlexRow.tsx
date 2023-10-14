import { PropsWithChildren } from "react"

export const FlexRow = (props: PropsWithChildren) => {
  return <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>{props.children}</div>
}
