'use client'
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Menu as BaseMenu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { useTheme } from '@mui/system';
import Link from 'next/link';
function useIsDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === 'dark';
}

function MenuSimple({ menuName, menuItems }) {
  const isDarkMode = useIsDarkMode();

  const createHandleMenuClick = (menuItem) => {
    return () => {
      console.log(`Clicked on ${menuItem}`);
    };
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <Dropdown>
        <MenuButton>{menuName}</MenuButton>
        <Menu>
          {menuItems.map((item) => (
            <MenuItem key={item} onClick={createHandleMenuClick(item)}>
                <Link href={'/'} >
                    {item}
                </Link>
            </MenuItem>
          ))}
        </Menu>
      </Dropdown>
    </div>
  );
}

MenuSimple.propTypes = {
  menuName: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const resolveSlotProps = (fn, args) => (typeof fn === 'function' ? fn(args) : fn);

const Menu = React.forwardRef((props, ref) => {
  const isDarkMode = useIsDarkMode();

  return (
    <BaseMenu
      ref={ref}
      {...props}
      slotProps={{
        ...props.slotProps,
        root: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.root,
            ownerState,
          );
          return {
            ...resolvedSlotProps,
            className: clsx(
              `${isDarkMode ? 'dark' : ''} z-10`,
              resolvedSlotProps?.className,
            ),
          };
        },
        listbox: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.listbox,
            ownerState,
          );
          return {
            ...resolvedSlotProps,
            className: clsx(
              'text-sm box-border font-sans p-1.5 my-3 mx-0 rounded-xl overflow-auto outline-0 bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-300 min-w-listbox shadow-md dark:shadow-slate-900',
              resolvedSlotProps?.className,
            ),
          };
        },
      }}
    />
  );
});

Menu.propTypes = {
  slotProps: PropTypes.shape({
    listbox: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }),
};

const MenuButton = React.forwardRef((props, ref) => {
  const { className, ...other } = props;
  return (
    <BaseMenuButton
      ref={ref}
      className={clsx(
        'cursor-pointer text-sm font-sans box-border rounded-lg font-semibold px-4 py-2 bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:shadow-[0_0_0_4px_#ddd6fe] dark:focus-visible:shadow-[0_0_0_4px_#a78bfa] focus-visible:outline-none shadow-sm active:shadow-none',
        className,
      )}
      {...other}
    />
  );
});

MenuButton.propTypes = {
  className: PropTypes.string,
};

const MenuItem = React.forwardRef((props, ref) => {
  const { className, ...other } = props;
  return (
    <BaseMenuItem
      ref={ref}
      className={clsx(
        'list-none p-2 rounded-lg cursor-default select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 focus:dark:bg-slate-800 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:dark:text-slate-700 disabled:hover:text-slate-400 disabled:hover:dark:text-slate-700',
        className,
      )}
      {...other}
    />
  );
});

MenuItem.propTypes = {
  className: PropTypes.string,
};

export default MenuSimple;