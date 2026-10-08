import { Button, Group, SegmentedControl, Stack, Switch, Text, useMantineColorScheme } from '@mantine/core';
import { useSidebarPreference } from './preferences.ts';

export default function Configuration() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [collapsed, setCollapsed] = useSidebarPreference();

  return (
    <Stack gap='lg' className='hydro-configuration'>
      <div>
        <Text fw={600} size='lg'>
          Appearance
        </Text>
        <Text c='dimmed' size='sm'>
          Dark surfaces, cream accents, and compact navigation across your panel.
        </Text>
      </div>
      <SegmentedControl
        aria-label='Color scheme'
        value={colorScheme}
        onChange={(value) => setColorScheme(value as 'light' | 'dark' | 'auto')}
        data={[
          { label: 'Dark', value: 'dark' },
          { label: 'Light', value: 'light' },
          { label: 'System', value: 'auto' },
        ]}
      />
      <Switch
        label='Compact desktop navigation'
        description='Remember the sidebar size on this device.'
        checked={collapsed}
        onChange={(event) => setCollapsed(event.currentTarget.checked)}
      />
      <div className='hydro-preview-card'>
        <Group justify='space-between'>
          <Text fw={600}>Theme preview</Text>
          <span className='hydro-status-pill'>Online</span>
        </Group>
        <Text c='dimmed' size='sm' mt='xs'>
          Your server console, files, and settings share the same charcoal palette.
        </Text>
        <Group mt='md'>
          <Button>Primary action</Button>
          <Button variant='default'>Secondary action</Button>
        </Group>
      </div>
    </Stack>
  );
}
