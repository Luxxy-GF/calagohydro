# Reference file audit

Reference revision: `e3c445fd4ecffe57e786894f8b9dfc6340526176`. All **407** files under `resources/scripts` were read and fingerprinted. This is an inventory of adaptation boundaries, not a claim that every upstream module executes inside Calagopus.

The extension replaces the modern shell, console, dashboard rows, main server resource pages, startup/settings and account resource pages. Remaining Calagopus pages use shared component and workspace styles. Native API clients, authentication, permission checks, dialogs, operations and drag/drop controllers remain authoritative. Hydrodactyl-only installer/software/marketplace/subdomain and game-specific integrations are not implemented by this theme.

## Dispositions

- reference-test: 13
- shared presentation adapted: 131
- native API retained: 82
- reference-only feature: 34
- presentation adapted: 73
- native feedback retained: 5
- superseded layout: 5
- native runtime retained: 64

Reproduce: `python3 tools/audit-source.py /path/to/hydrodactyl-reference`. JSON includes per-file SHA-256, imports, size, destinations and reasons.

## Files

| Reference file | Disposition | Destination |
| --- | --- | --- |
| `__mocks__/file.ts` | reference-test |  |
| `admin/index.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `api/account/activity.ts` | native API retained | `frontend/src/api` |
| `api/account/createApiKey.ts` | native API retained | `frontend/src/api` |
| `api/account/deleteApiKey.ts` | native API retained | `frontend/src/api` |
| `api/account/disableAccountTwoFactor.ts` | native API retained | `frontend/src/api` |
| `api/account/enableAccountTwoFactor.ts` | native API retained | `frontend/src/api` |
| `api/account/getApiKeys.ts` | native API retained | `frontend/src/api` |
| `api/account/getTwoFactorTokenData.ts` | native API retained | `frontend/src/api` |
| `api/account/ssh-keys.ts` | native API retained | `frontend/src/api` |
| `api/account/updateAccountEmail.ts` | native API retained | `frontend/src/api` |
| `api/account/updateAccountPassword.ts` | native API retained | `frontend/src/api` |
| `api/auth/login.ts` | native API retained | `frontend/src/api` |
| `api/auth/loginCheckpoint.ts` | native API retained | `frontend/src/api` |
| `api/auth/performPasswordReset.ts` | native API retained | `frontend/src/api` |
| `api/auth/setup.ts` | native API retained | `frontend/src/api` |
| `api/definitions/helpers.ts` | native API retained | `frontend/src/api` |
| `api/definitions/index.d.ts` | native API retained | `frontend/src/api` |
| `api/definitions/user/index.ts` | native API retained | `frontend/src/api` |
| `api/definitions/user/models.d.ts` | native API retained | `frontend/src/api` |
| `api/definitions/user/transformers.ts` | native API retained | `frontend/src/api` |
| `api/getFilterOptions.ts` | native API retained | `frontend/src/api` |
| `api/getServers.ts` | native API retained | `frontend/src/api` |
| `api/getSystemPermissions.ts` | native API retained | `frontend/src/api` |
| `api/http.ts` | native API retained | `frontend/src/api` |
| `api/interceptors.ts` | native API retained | `frontend/src/api` |
| `api/mclo.gs/mclogsApi.ts` | reference-only feature |  |
| `api/nests/getNests.ts` | reference-only feature |  |
| `api/server/activity.ts` | native API retained | `frontend/src/api` |
| `api/server/applyEggChange.ts` | reference-only feature |  |
| `api/server/applyEggChangeSync.ts` | reference-only feature |  |
| `api/server/backups/createServerBackup.ts` | native API retained | `frontend/src/api` |
| `api/server/backups/deleteAllServerBackups.ts` | native API retained | `frontend/src/api` |
| `api/server/backups/deleteServerBackup.ts` | native API retained | `frontend/src/api` |
| `api/server/backups/getBackupStatus.ts` | native API retained | `frontend/src/api` |
| `api/server/backups/getServerBackupDownloadUrl.ts` | native API retained | `frontend/src/api` |
| `api/server/backups/index.ts` | native API retained | `frontend/src/api` |
| `api/server/backups/renameServerBackup.ts` | native API retained | `frontend/src/api` |
| `api/server/backups/retryBackup.ts` | native API retained | `frontend/src/api` |
| `api/server/databases/createServerDatabase.ts` | native API retained | `frontend/src/api` |
| `api/server/databases/deleteServerDatabase.ts` | native API retained | `frontend/src/api` |
| `api/server/databases/getServerDatabases.ts` | native API retained | `frontend/src/api` |
| `api/server/databases/rotateDatabasePassword.ts` | native API retained | `frontend/src/api` |
| `api/server/files/chmodFiles.ts` | native API retained | `frontend/src/api` |
| `api/server/files/compressFiles.ts` | native API retained | `frontend/src/api` |
| `api/server/files/copyFile.ts` | native API retained | `frontend/src/api` |
| `api/server/files/createDirectory.ts` | native API retained | `frontend/src/api` |
| `api/server/files/decompressFiles.ts` | native API retained | `frontend/src/api` |
| `api/server/files/deleteFiles.ts` | native API retained | `frontend/src/api` |
| `api/server/files/getFileContents.ts` | native API retained | `frontend/src/api` |
| `api/server/files/getFileDownloadUrl.ts` | native API retained | `frontend/src/api` |
| `api/server/files/getFileUploadUrl.ts` | native API retained | `frontend/src/api` |
| `api/server/files/loadDirectory.ts` | native API retained | `frontend/src/api` |
| `api/server/files/pullFile.ts` | native API retained | `frontend/src/api` |
| `api/server/files/renameFiles.ts` | native API retained | `frontend/src/api` |
| `api/server/files/saveFileContents.ts` | native API retained | `frontend/src/api` |
| `api/server/getServer.ts` | native API retained | `frontend/src/api` |
| `api/server/getServerResourceUsage.ts` | native API retained | `frontend/src/api` |
| `api/server/getWebsocketToken.ts` | native API retained | `frontend/src/api` |
| `api/server/marketplace.ts` | reference-only feature |  |
| `api/server/network/createServerAllocation.ts` | native API retained | `frontend/src/api` |
| `api/server/network/deleteServerAllocation.ts` | native API retained | `frontend/src/api` |
| `api/server/network/setPrimaryServerAllocation.ts` | native API retained | `frontend/src/api` |
| `api/server/network/setServerAllocationNotes.ts` | native API retained | `frontend/src/api` |
| `api/server/network/subdomain.ts` | reference-only feature |  |
| `api/server/previewEggChange.ts` | reference-only feature |  |
| `api/server/processStartupCommand.ts` | native API retained | `frontend/src/api` |
| `api/server/reinstallServer.ts` | native API retained | `frontend/src/api` |
| `api/server/renameServer.ts` | native API retained | `frontend/src/api` |
| `api/server/resetStartupCommand.ts` | native API retained | `frontend/src/api` |
| `api/server/revertDockerImage.ts` | native API retained | `frontend/src/api` |
| `api/server/schedules/createOrUpdateSchedule.ts` | native API retained | `frontend/src/api` |
| `api/server/schedules/createOrUpdateScheduleTask.ts` | native API retained | `frontend/src/api` |
| `api/server/schedules/deleteSchedule.ts` | native API retained | `frontend/src/api` |
| `api/server/schedules/deleteScheduleTask.ts` | native API retained | `frontend/src/api` |
| `api/server/schedules/getServerSchedule.ts` | native API retained | `frontend/src/api` |
| `api/server/schedules/getServerSchedules.ts` | native API retained | `frontend/src/api` |
| `api/server/schedules/triggerScheduleExecution.ts` | native API retained | `frontend/src/api` |
| `api/server/serverOperations.ts` | native API retained | `frontend/src/api` |
| `api/server/setSelectedDockerImage.ts` | native API retained | `frontend/src/api` |
| `api/server/types.d.ts` | native API retained | `frontend/src/api` |
| `api/server/updateStartupCommand.ts` | native API retained | `frontend/src/api` |
| `api/server/updateStartupVariable.ts` | native API retained | `frontend/src/api` |
| `api/server/users/createOrUpdateSubuser.ts` | native API retained | `frontend/src/api` |
| `api/server/users/deleteSubuser.ts` | native API retained | `frontend/src/api` |
| `api/server/users/getServerSubusers.ts` | native API retained | `frontend/src/api` |
| `api/serverGroups.ts` | native API retained | `frontend/src/api` |
| `api/swr/getServerAllocations.ts` | native API retained | `frontend/src/api` |
| `api/swr/getServerBackups.ts` | native API retained | `frontend/src/api` |
| `api/swr/getServerStartup.ts` | native API retained | `frontend/src/api` |
| `api/transformers.spec.ts` | reference-test |  |
| `api/transformers.ts` | native API retained | `frontend/src/api` |
| `assets/css/GlobalStylesheet.ts` | presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts` |
| `assets/globals.css` | presentation adapted | `frontend/src/app.css` |
| `assets/images/not_found.svg` | native feedback retained | `frontend/src/Feedback.tsx` |
| `assets/images/pterodactyl.svg` | native feedback retained | `frontend/src/Feedback.tsx` |
| `assets/images/server_error.svg` | native feedback retained | `frontend/src/Feedback.tsx` |
| `assets/images/server_installing.svg` | native feedback retained | `frontend/src/Feedback.tsx` |
| `assets/images/server_restore.svg` | native feedback retained | `frontend/src/Feedback.tsx` |
| `assets/tailwind.css` | presentation adapted | `frontend/src/app.css` |
| `assets/tailwindcss-animate.css` | presentation adapted | `frontend/src/app.css` |
| `components/App.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/FlashMessageRender.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/HeaderManger.tsx` | presentation adapted | `frontend/src/headerSlots.ts`, `frontend/src/PageLayout.tsx` |
| `components/HydrodactylProvider.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/MessageBox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/auth/ForgotPasswordContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/auth/LoginCheckpointContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/auth/LoginContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/auth/LoginFormContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/auth/ResetPasswordContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/auth/StatusContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/AccountApiContainer.tsx` | presentation adapted | `frontend/src/pages/DashboardApiKeys.tsx`, `frontend/src/pages/ApiKeyRow.tsx` |
| `components/dashboard/AccountOverviewContainer.tsx` | presentation adapted | `frontend/src/pages/DashboardAccount.tsx` |
| `components/dashboard/ApiKeyModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/CreateApiKeyModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/CreateGroupModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/DashboardContainer.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/pages/ServerItem.tsx` |
| `components/dashboard/GroupSection.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/ServerRow.tsx` | presentation adapted | `frontend/src/pages/ServerItem.tsx`, `frontend/src/overrides.ts` |
| `components/dashboard/activity/ActivityLogContainer.tsx` | presentation adapted | `frontend/src/pages/DashboardActivity.tsx`, `frontend/src/ActivityList.tsx`, `frontend/src/pages/ActivityRow.tsx` |
| `components/dashboard/forms/ConfigureTwoFactorForm.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/forms/CreateApiKeyForm.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/forms/DisableTOTPDialog.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/forms/RecoveryTokensDialog.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/forms/SetupTOTPDialog.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/forms/UpdateEmailAddressForm.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/forms/UpdatePasswordForm.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/header/FilterDropdown.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/headerSlots.ts`, `frontend/src/app.css` |
| `components/dashboard/header/FiltersMenu.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/headerSlots.ts`, `frontend/src/app.css` |
| `components/dashboard/header/GroupDropdown.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/headerSlots.ts`, `frontend/src/app.css` |
| `components/dashboard/header/HeaderCentered.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/headerSlots.ts`, `frontend/src/app.css` |
| `components/dashboard/header/OwnerFilterDropdown.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/headerSlots.ts`, `frontend/src/app.css` |
| `components/dashboard/header/SearchSection.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/headerSlots.ts`, `frontend/src/app.css` |
| `components/dashboard/header/SortDropdown.tsx` | presentation adapted | `frontend/src/PageLayout.tsx`, `frontend/src/headerSlots.ts`, `frontend/src/app.css` |
| `components/dashboard/ssh/AccountSSHContainer.tsx` | presentation adapted | `frontend/src/pages/DashboardSshKeys.tsx`, `frontend/src/pages/SshKeyRow.tsx` |
| `components/dashboard/ssh/CreateSSHKeyForm.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/dashboard/ssh/DeleteSSHKeyButton.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/AuthenticatedRoute.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Button.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ButtonV2.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Can.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Captcha.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/CheckboxLabel.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/CheckboxNew.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Code.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Collapse.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ConfirmationModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ContentBox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ContextMenu.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/CopyOnClick.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/DropdownMenu.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ErrorBoundary.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Field.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/FormikFieldWrapper.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/FormikSwitchV2.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/HydroLogo.tsx` | presentation adapted | `frontend/src/Logo.tsx` |
| `components/elements/Input.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/InputError.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/InputSpinner.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ItemContainer.tsx` | presentation adapted | `frontend/src/ResourceList.tsx`, `frontend/src/app.css` |
| `components/elements/Label.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/MainPageHeader.tsx` | superseded layout | `frontend/src/Sidebar.tsx` |
| `components/elements/MainSidebar.tsx` | superseded layout | `frontend/src/Sidebar.tsx` |
| `components/elements/MainWrapper.tsx` | superseded layout | `frontend/src/Sidebar.tsx` |
| `components/elements/MobileFullScreenMenu.tsx` | superseded layout | `frontend/src/Sidebar.tsx` |
| `components/elements/MobileTopBar.tsx` | superseded layout | `frontend/src/Sidebar.tsx` |
| `components/elements/ModBox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Modal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/PageContentBlock.tsx` | presentation adapted | `frontend/src/PageLayout.tsx` |
| `components/elements/Pagination.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/PermissionRoute.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ScreenBlock.tsx` | presentation adapted | `frontend/src/Feedback.tsx` |
| `components/elements/Select.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/ServerContentBlock.tsx` | presentation adapted | `frontend/src/PageLayout.tsx` |
| `components/elements/Spinner.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/SpinnerOverlay.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Switch.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/SwitchV2.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/SwitchV2Container.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/Tabs.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/TextInput.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/TitledGreyBox.tsx` | presentation adapted | `frontend/src/TitledGreyBox.tsx` |
| `components/elements/VirtualizedList.tsx` | presentation adapted | `frontend/src/ResourceList.tsx` |
| `components/elements/activity/ActivityLogEntry.tsx` | presentation adapted | `frontend/src/ActivityList.tsx`, `frontend/src/pages/ActivityRow.tsx`, `frontend/src/app.css` |
| `components/elements/activity/ActivityLogMetaButton.tsx` | presentation adapted | `frontend/src/ActivityList.tsx`, `frontend/src/pages/ActivityRow.tsx`, `frontend/src/app.css` |
| `components/elements/activity/style.module.css` | presentation adapted | `frontend/src/ActivityList.tsx`, `frontend/src/pages/ActivityRow.tsx`, `frontend/src/app.css` |
| `components/elements/alert/Alert.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/alert/index.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/commandk/CmdK.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/ConfirmationDialog.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/Dialog.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/DialogFooter.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/DialogIcon.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/context.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/index.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/style.module.css` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/dialog/types.d.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `components/elements/editor/Editor.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/editor/index.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/editor/theme.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/inputs/Checkbox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/inputs/InputField.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/inputs/index.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/inputs/styles.module.css` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/pages/PageList.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/table/PaginationFooter.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/elements/transitions/FadeTransition.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/history.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `components/layout/BottomNav.tsx` | presentation adapted | `frontend/src/Sidebar.tsx`, `frontend/src/NavIcon.tsx`, `frontend/src/app.css` |
| `components/layout/header/AppHeader.tsx` | presentation adapted | `frontend/src/Sidebar.tsx`, `frontend/src/ServerHeader.tsx` |
| `components/layout/header/UserDropdown.tsx` | presentation adapted | `frontend/src/UserDropdown.tsx` |
| `components/layout/sidebar/MobileSidebar.tsx` | presentation adapted | `frontend/src/Sidebar.tsx`, `frontend/src/NavIcon.tsx`, `frontend/src/app.css` |
| `components/layout/sidebar/NavItem.tsx` | presentation adapted | `frontend/src/Sidebar.tsx`, `frontend/src/NavIcon.tsx`, `frontend/src/app.css` |
| `components/layout/sidebar/Sidebar.tsx` | presentation adapted | `frontend/src/Sidebar.tsx`, `frontend/src/NavIcon.tsx`, `frontend/src/app.css` |
| `components/layout/sidebar/sidebar-logo.css` | presentation adapted | `frontend/src/Sidebar.tsx`, `frontend/src/NavIcon.tsx`, `frontend/src/app.css` |
| `components/layout/sidebar/sidebar-modern.css` | presentation adapted | `frontend/src/Sidebar.tsx`, `frontend/src/NavIcon.tsx`, `frontend/src/app.css` |
| `components/server/ConflictStateRenderer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/InstallListener.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/ServerActivityLogContainer.tsx` | presentation adapted | `frontend/src/pages/ServerActivity.tsx`, `frontend/src/ActivityList.tsx` |
| `components/server/ServerSidebarNavItem.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/TransferListener.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/UptimeDuration.ts` | presentation adapted | `frontend/src/UptimeDuration.ts` |
| `components/server/WebsocketHandler.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/BackupContainer.tsx` | presentation adapted | `frontend/src/pages/ServerBackups.tsx`, `frontend/src/pages/BackupGroupItem.tsx` |
| `components/server/backups/BackupContextMenu.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/BackupItem.tsx` | presentation adapted | `frontend/src/pages/BackupRow.tsx` |
| `components/server/backups/components/BackupStats.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/components/BulkActionBar.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/components/ConfirmPasswordModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/components/CreateBackupModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/components/backupStorageFormat.spec.ts` | reference-test |  |
| `components/server/backups/components/backupStorageFormat.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/elytra/BackupContextMenu.tsx` | reference-only feature |  |
| `components/server/backups/types.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/backups/useUnifiedBackups.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/console/ChartBlock.tsx` | presentation adapted | `frontend/src/ServerConsole.tsx`, `frontend/src/StatGraphs.tsx`, `frontend/src/app.css` |
| `components/server/console/Console.tsx` | presentation adapted | `frontend/src/ServerConsole.tsx`, `frontend/src/StatGraphs.tsx`, `frontend/src/app.css` |
| `components/server/console/PowerButtons.tsx` | presentation adapted | `frontend/src/PowerButtons.tsx` |
| `components/server/console/ServerConsoleContainer.tsx` | presentation adapted | `frontend/src/ServerConsole.tsx`, `frontend/src/StatGraphs.tsx`, `frontend/src/app.css` |
| `components/server/console/StatBlock.tsx` | presentation adapted | `frontend/src/ServerConsole.tsx`, `frontend/src/StatGraphs.tsx`, `frontend/src/app.css` |
| `components/server/console/StatGraphs.tsx` | presentation adapted | `frontend/src/ServerConsole.tsx`, `frontend/src/StatGraphs.tsx`, `frontend/src/app.css` |
| `components/server/console/chart.ts` | presentation adapted | `frontend/src/chart.ts` |
| `components/server/console/console.css` | presentation adapted | `frontend/src/ServerConsole.tsx`, `frontend/src/StatGraphs.tsx`, `frontend/src/app.css` |
| `components/server/databases/DatabaseConnectionModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/databases/DatabaseRow.tsx` | presentation adapted | `frontend/src/pages/DatabaseRow.tsx` |
| `components/server/databases/DatabasesContainer.tsx` | presentation adapted | `frontend/src/pages/ServerDatabases.tsx` |
| `components/server/databases/DeleteDatabaseModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/databases/RotatePasswordButton.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/events.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/features/Features.tsx` | reference-only feature |  |
| `components/server/features/GSLTokenModalFeature.tsx` | reference-only feature |  |
| `components/server/features/HytaleOauthRequireFeature.tsx` | reference-only feature |  |
| `components/server/features/JavaVersionModalFeature.tsx` | reference-only feature |  |
| `components/server/features/MclogsFeature.tsx` | reference-only feature |  |
| `components/server/features/PIDLimitModalFeature.tsx` | reference-only feature |  |
| `components/server/features/SteamDiskSpaceFeature.tsx` | reference-only feature |  |
| `components/server/features/eula/EulaModalFeature.tsx` | reference-only feature |  |
| `components/server/features/index.ts` | reference-only feature |  |
| `components/server/files/ChmodFileModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/FileDropdownMenu.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/FileEditContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/FileManagerBreadcrumbs.tsx` | presentation adapted | `frontend/src/pages/FileBreadcrumbs.tsx` |
| `components/server/files/FileManagerContainer.tsx` | presentation adapted | `frontend/src/pages/ServerFiles.tsx` |
| `components/server/files/FileManagerStatus.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/FileNameModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/FileObjectRow.tsx` | presentation adapted | `frontend/src/pages/FileRow.tsx`, `frontend/src/pages/FileRowIcon.tsx`, `frontend/src/pages/SelectableFileRow.tsx`, `frontend/src/pages/FileParentDirectoryRow.tsx` |
| `components/server/files/MassActionsBar.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/NewDirectoryButton.tsx` | presentation adapted | `frontend/src/pages/FileToolbar.tsx` |
| `components/server/files/NewFileButton.tsx` | presentation adapted | `frontend/src/pages/FileToolbar.tsx` |
| `components/server/files/RenameFileModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/SelectFileCheckbox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/files/UploadButton.tsx` | presentation adapted | `frontend/src/pages/FileToolbar.tsx` |
| `components/server/files/style.module.css` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/header/PowerButtons.tsx` | presentation adapted | `frontend/src/ServerHeader.tsx`, `frontend/src/PowerButtons.tsx`, `frontend/src/Sidebar.tsx` |
| `components/server/header/ServerDetailsHeader.tsx` | presentation adapted | `frontend/src/ServerHeader.tsx`, `frontend/src/PowerButtons.tsx`, `frontend/src/Sidebar.tsx` |
| `components/server/header/ServerHeader.tsx` | presentation adapted | `frontend/src/ServerHeader.tsx`, `frontend/src/PowerButtons.tsx`, `frontend/src/Sidebar.tsx` |
| `components/server/header/StatusPillHeader.tsx` | presentation adapted | `frontend/src/ServerHeader.tsx`, `frontend/src/PowerButtons.tsx`, `frontend/src/Sidebar.tsx` |
| `components/server/installer/InstallerCard.tsx` | reference-only feature |  |
| `components/server/installer/InstallerContainer.tsx` | reference-only feature |  |
| `components/server/installer/VersionPicker.tsx` | reference-only feature |  |
| `components/server/installer/eggFeatures.ts` | reference-only feature |  |
| `components/server/installer/installedState.ts` | reference-only feature |  |
| `components/server/installer/sources.ts` | reference-only feature |  |
| `components/server/network/AllocationRow.tsx` | presentation adapted | `frontend/src/pages/AllocationRow.tsx` |
| `components/server/network/DeleteAllocationButton.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/network/NetworkContainer.tsx` | presentation adapted | `frontend/src/pages/ServerNetwork.tsx` |
| `components/server/network/SubdomainManagement.tsx` | reference-only feature |  |
| `components/server/operations/OperationProgressModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/operations/WingsOperationProgressModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/schedules/DeleteScheduleButton.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/schedules/EditScheduleModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/schedules/ScheduleCheatsheetCards.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/schedules/ScheduleContainer.tsx` | presentation adapted | `frontend/src/pages/ServerSchedules.tsx` |
| `components/server/schedules/ScheduleCronRow.tsx` | presentation adapted | `frontend/src/ScheduleCronRow.tsx` |
| `components/server/schedules/ScheduleEditContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/schedules/ScheduleRow.tsx` | presentation adapted | `frontend/src/pages/ScheduleRow.tsx` |
| `components/server/schedules/ScheduleTaskRow.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/schedules/TaskDetailsModal.spec.ts` | reference-test |  |
| `components/server/schedules/TaskDetailsModal.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/settings/ReinstallServerBox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/settings/RenameServerBox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/settings/SettingsContainer.tsx` | presentation adapted | `frontend/src/pages/ServerSettings.tsx`, `frontend/src/SftpDetails.tsx` |
| `components/server/software/DescriptionText.tsx` | reference-only feature |  |
| `components/server/software/GameSelection.tsx` | reference-only feature |  |
| `components/server/software/ReviewChanges.tsx` | reference-only feature |  |
| `components/server/software/SoftwareConfiguration.tsx` | reference-only feature |  |
| `components/server/software/SoftwareContainer.tsx` | reference-only feature |  |
| `components/server/software/SoftwareOverview.tsx` | reference-only feature |  |
| `components/server/software/SoftwareSelection.tsx` | reference-only feature |  |
| `components/server/software/WipeConfirmationModal.tsx` | reference-only feature |  |
| `components/server/software/types.ts` | reference-only feature |  |
| `components/server/startup/StartupContainer.tsx` | presentation adapted | `frontend/src/pages/ServerStartup.tsx`, `frontend/src/GlobalVariables.tsx` |
| `components/server/startup/VariableBox.tsx` | presentation adapted | `frontend/src/pages/VariableBox.tsx` |
| `components/server/users/CreateUserContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/users/EditUserContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/users/PermissionRow.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/users/PermissionTitleBox.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/users/RemoveSubuserButton.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/users/UserFormComponent.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/server/users/UserRow.tsx` | presentation adapted | `frontend/src/pages/SubuserRow.tsx` |
| `components/server/users/UsersContainer.tsx` | presentation adapted | `frontend/src/pages/ServerSubusers.tsx` |
| `components/setup/SetupContainer.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/types.ts` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/button.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/dropdown-menu.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/input.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/keyboard-shortcut.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/secondary-link.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/skeleton.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/styles.css` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `components/ui/tooltip.tsx` | shared presentation adapted | `frontend/src/app.css`, `frontend/src/theme.ts`, `frontend/src/PageLayout.tsx` |
| `context/ModalContext.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `contexts/HeaderContext.tsx` | presentation adapted | `frontend/src/headerSlots.ts` |
| `contexts/SidebarContext.tsx` | presentation adapted | `frontend/src/preferences.ts`, `frontend/src/Sidebar.tsx` |
| `easy-peasy.d.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `globals.d.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `helpers/captcha.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `helpers.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `hoc/RequireServerPermission.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `hoc/asDialog.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `hoc/asModal.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `index.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/CaptchaManager.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/CaptchaProvider.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/CaptchaProviderFactory.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/index.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/providers/CapProvider.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/providers/HCaptchaProvider.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/providers/NullProvider.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/providers/RecaptchaProvider.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/providers/TurnstileProvider.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/captcha/types.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/featureLimits.spec.ts` | reference-test |  |
| `lib/featureLimits.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/formatters.spec.ts` | reference-test |  |
| `lib/formatters.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/helpers.spec.ts` | reference-test |  |
| `lib/helpers.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/mclogsUtils.spec.ts` | reference-test |  |
| `lib/mclogsUtils.ts` | reference-only feature |  |
| `lib/objects.spec.ts` | reference-test |  |
| `lib/objects.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/server-operations.spec.ts` | reference-test |  |
| `lib/server-operations.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/strings.spec.ts` | reference-test |  |
| `lib/strings.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `lib/utils.spec.ts` | reference-test |  |
| `lib/utils.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `macros.d.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `modes.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/Websocket.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/XtermScrollDownHelperAddon.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useDeepCompareEffect.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useDeepCompareMemo.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useDeepMemoize.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useEventListener.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useFileManagerSwr.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useFilteredObject.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useFlash.spec.ts` | reference-test |  |
| `plugins/useFlash.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useLocationHash.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/usePermissions.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/usePersistedState.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useSWRKey.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useVW.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `plugins/useWebsocketEvent.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `routers/AuthenticationRouter.tsx` | presentation adapted | `frontend/src/AuthWrapper.tsx`, `frontend/src/app.css` |
| `routers/DashboardRouter.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `routers/ServerRouter.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `routers/SetupRouter.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `routers/UnifiedRouter.tsx` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `routers/routes.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/flashes.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/hooks.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/index.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/permissions.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/progress.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/server/databases.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/server/files.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/server/index.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/server/schedules.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/server/socket.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/server/subusers.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/settings.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `state/user.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
| `vite-env.d.ts` | native runtime retained | `frontend/src/providers`, `frontend/src/stores`, `frontend/src/index.tsx` |
