
export const ImageIcon = (props: {iconUrl: string}) =>{
  return <img width={'24px'} src={chrome.runtime.getURL(props.iconUrl)} />;
}