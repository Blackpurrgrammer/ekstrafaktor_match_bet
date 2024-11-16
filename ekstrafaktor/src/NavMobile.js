import React, { useState } from 'react';
import { Drawer} from 'antd';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import './App.css';

const NavMobile = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="navbar-header">
        <h1>Ekstrafaktor</h1>
        <div className='menu-icon' onClick={showDrawer}>
            <MenuOutlined />
        </div>
        {/* <Button type="primary" onClick={showDrawer} icon={<MenuOutlined />} /> */}
      </div>
      <Drawer
        title="Lukk"
        placement="right"
        onClose={onClose}
        visible={visible}
        className='drawer-nav-menu'
      >
        <ul>
          <li>
            <Link to="/" onClick={onClose}>Dagens Kamper</Link>
          </li>
          <li>
            <Link to="/Spilte_kamper" onClick={onClose}>Spilte kamper</Link>
          </li>
          <li>
            <Link to="/Avgjorende_skader" onClick={onClose}>Avgjørende Skader</Link>
          </li>
          <li>
            <Link to="/Signin" onClick={onClose}>Sign In/Up</Link>
          </li>
        </ul>
      </Drawer>
    </div>
  );
};

export default NavMobile;