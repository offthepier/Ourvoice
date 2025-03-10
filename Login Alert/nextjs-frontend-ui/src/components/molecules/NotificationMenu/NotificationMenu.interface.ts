interface INotificationMenu {
  onClose?: () => void;
  anchorEl?: any;
  open?: boolean;
  onNotificationCountUpdate?: (count: number) => void;
}

export default INotificationMenu;
