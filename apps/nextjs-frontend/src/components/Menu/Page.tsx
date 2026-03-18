"use client"
import { JSX, useState } from 'react';
// import { useRouter } from 'next/router';

// 定义每个菜单项的数据结构
interface MenuItem {
  id: number;
  label: string;
  path: string;
  children?: MenuItem[];  // 子菜单项是可选的
}

// 定义 Menu 组件的 props
interface MenuProps {
  menuData: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ menuData }) => {
  // 设置激活菜单的状态
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
//   const router = useRouter();

  // 处理菜单点击事件
  const handleMenuClick = (id: number): void => {
    // 切换当前激活菜单
    setActiveMenu(activeMenu === id ? null : id);
  };

  // 渲染菜单项
  const renderMenu = (menu: MenuItem): JSX.Element => {
    const isActive = activeMenu === menu.id;

    return (
      <div key={menu.id}>
        <div
          style={{
            cursor: 'pointer',
            fontWeight: isActive ? 'bold' : 'normal',
          }}
          onClick={() => handleMenuClick(menu.id)}
        >
          <span>{menu.label}</span>
        </div>
        {/* 如果菜单有子菜单，并且该菜单是激活状态，则显示子菜单 */}
        {menu.children && isActive && (
          <div style={{ paddingLeft: '20px' }}>
            {menu.children.map((child) => (
              <div
                key={child.id}
               /*  style={{ fontWeight: router.pathname === child.path ? 'bold' : 'normal' }}
                onClick={() => router.push(child.path)} */
              >
                <span>{child.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {menuData.map(renderMenu)}
    </div>
  );
};

export default Menu;
