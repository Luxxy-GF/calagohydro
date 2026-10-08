use shared::extensions::Extension;

/// The theme has no backend behavior; this companion makes it distributable
/// through Calagopus's standard extension installer.
#[derive(Default)]
pub struct ExtensionStruct;

#[async_trait::async_trait]
impl Extension for ExtensionStruct {}
