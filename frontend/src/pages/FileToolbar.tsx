import {
  faChevronDown,
  faDownload,
  faFileCirclePlus,
  faFileUpload,
  faFolderOpen,
  faFolderPlus,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createSearchParams, useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import Button from '@/elements/buttons/Button.tsx';
import { ServerCan } from '@/elements/Can.tsx';
import ExtensionSlot from '@/elements/ExtensionSlot.tsx';
import Group from '@/elements/layout/Group.tsx';
import ContextMenu from '@/elements/overlays/ContextMenu.tsx';
import FileConnectButton from '@/pages/server/files/FileConnectButton.tsx';
import { useFileManager } from '@/providers/FileManagerProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useServerStore } from '@/stores/server.ts';

export default function FileToolbar({ onCreateFile }: { onCreateFile?: () => void }) {
  const { t } = useTranslations();
  const navigate = useNavigate();
  const server = useServerStore((state) => state.server);
  const { fileInputRef, folderInputRef, browsingDirectory, browsingWritableDirectory, doOpenModal } = useFileManager(
    useShallow((state) => ({
      fileInputRef: state.fileInputRef,
      folderInputRef: state.folderInputRef,
      browsingDirectory: state.browsingDirectory,
      browsingWritableDirectory: state.browsingWritableDirectory,
      doOpenModal: state.doOpenModal,
    })),
  );

  return (
    <Group className='hydro-file-toolbar'>
      <ExtensionSlot
        components={window.extensionContext.extensionRegistry.pages.server.files.fileToolbar.prependedComponents}
        name='files-fileToolbar-prepended'
      />
      {browsingWritableDirectory && (
        <ServerCan action='files.create'>
          <div className='hydro-file-create-pair'>
            <Button
              variant='default'
              aria-label={t('pages.server.files.button.directory', {})}
              onClick={() => doOpenModal('nameDirectory')}
            >
              New Folder
            </Button>
            <Button
              variant='default'
              aria-label={t('pages.server.files.button.fileFromEditor', {})}
              onClick={
                onCreateFile ??
                (() =>
                  navigate(
                    `/server/${server.uuidShort}/files/new?${createSearchParams({ directory: browsingDirectory })}`,
                  ))
              }
            >
              New File
            </Button>
          </div>
        </ServerCan>
      )}
      <ServerCan action='files.create'>
        {browsingWritableDirectory && (
          <Button
            variant='default'
            aria-label={t('pages.server.files.button.fileFromUpload', {})}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </Button>
        )}
      </ServerCan>
      <Group className='hydro-file-extras'>
        <FileConnectButton />
        {browsingWritableDirectory && (
          <ServerCan action='files.create'>
            <ContextMenu
              items={[
                {
                  type: 'action',
                  icon: faFileCirclePlus,
                  label: t('pages.server.files.button.fileFromEditor', {}),
                  onClick:
                    onCreateFile ??
                    (() =>
                      navigate(
                        `/server/${server.uuidShort}/files/new?${createSearchParams({ directory: browsingDirectory })}`,
                      )),
                  color: 'gray',
                },
                {
                  type: 'action',
                  icon: faFolderPlus,
                  label: t('pages.server.files.button.directory', {}),
                  onClick: () => doOpenModal('nameDirectory'),
                  color: 'gray',
                },
                {
                  type: 'action',
                  icon: faLink,
                  label: t('pages.server.files.button.symlink', {}),
                  onClick: () => doOpenModal('nameSymlink', []),
                  color: 'gray',
                },
                {
                  type: 'action',
                  icon: faDownload,
                  label: t('pages.server.files.button.fileFromPull', {}),
                  onClick: () => doOpenModal('pullFile'),
                  color: 'gray',
                },
                {
                  type: 'action',
                  icon: faFileUpload,
                  label: t('pages.server.files.button.fileFromUpload', {}),
                  onClick: () => fileInputRef.current?.click(),
                  color: 'gray',
                },
                {
                  type: 'action',
                  icon: faFolderOpen,
                  label: t('pages.server.files.button.directoryFromUpload', {}),
                  onClick: () => folderInputRef.current?.click(),
                  color: 'gray',
                },
              ]}
              registry={window.extensionContext.extensionRegistry.pages.server.files.newFileContextMenu}
              registryProps={{}}
            >
              {({ openMenu }) => (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    openMenu(rect.left, rect.bottom);
                  }}
                  color='blue'
                  rightSection={<FontAwesomeIcon icon={faChevronDown} />}
                >
                  More
                </Button>
              )}
            </ContextMenu>
          </ServerCan>
        )}
      </Group>
      <ExtensionSlot
        components={window.extensionContext.extensionRegistry.pages.server.files.fileToolbar.appendedComponents}
        name='files-fileToolbar-appended'
      />
    </Group>
  );
}
