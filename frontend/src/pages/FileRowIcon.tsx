/* FileObjectRow's source icons; preserve Calagopus virtual and extension icons. */
import { File, FileZipper, FolderOpenFill } from '@gravity-ui/icons';
import type { ComponentProps } from 'react';
import { isViewableArchive } from '@/lib/files/files.ts';
import CoreIcon from '@/pages/server/files/list/FileRowIcon.tsx';
import { useFileManagerStore } from '@/stores/fileManager.ts';

export default function FileRowIcon(props: ComponentProps<typeof CoreIcon>) {
  const fast = useFileManagerStore((state) => state.browsingFastDirectory);
  if (props.file?.virtual || window.extensionContext.extensionRegistry.pages.server.files.fileIconHandlers.length)
    return <CoreIcon {...props} />;
  const directory = props.directory || props.file?.directory;
  const archive = props.archive ?? (props.file ? isViewableArchive(props.file, fast) : false);
  const Icon = directory ? FolderOpenFill : archive ? FileZipper : File;
  return (
    <Icon width={20} height={20} className={props.className} data-file-manager-icon={directory ? 'folder' : 'file'} />
  );
}
