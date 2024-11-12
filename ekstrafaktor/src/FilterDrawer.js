
import React, { useEffect, useState, useMemo } from 'react';
import { Drawer, Tree } from 'antd';
import {FilterFilled} from '@ant-design/icons';


const FilterDrawer = (props) => {
  const [visible, setVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onCheck = (checkedKeysValue) => {//organiserer avkrysset data
    props.setCheckedKeys(checkedKeysValue);
    
  };
  
  const updateFilterOptions = (filteringData) => {
    const newFilterOptions = [//filtering kategorier
      { groupLabel: 'Liga', options: [] },
      { groupLabel: 'Typeskade', options: [] },
      { groupLabel: 'Lag', options: [] }
    ];
    if(filteringData){//filtering data er tilgjengelig
      for (let i = 0; i < filteringData.length; i++) {
        const player = filteringData[i];
        if (!newFilterOptions[1].options.includes(player.injuryType)) {//unngå duplikat kategori verdier i listen
          newFilterOptions[1].options.push(player.injuryType);
        }
        if (!newFilterOptions[2].options.map(option => option.split('-')[0]).includes(player.team)) {
          newFilterOptions[2].options.push(`${player.team}-${player.teamId}`);
        }
        if (!newFilterOptions[0].options.map(option => option.split('-')[0]).includes(player.league)) {
          newFilterOptions[0].options.push(`${player.league}-${player.leagueId}`);
        }
      }
      
      return newFilterOptions      
    }
    
    
  };

  useEffect(()=>props.setCheckedKeys([]), [props.selectedDate]);//nullstille checkedKeys pga ny dato forandring

  const rememberedFilter = useMemo(()=>//lagre filterOptions for å unngå uendelig oppdatering
    updateFilterOptions(props.data),
    [props.data, props.checkedKeys]);

  
  useEffect(() => {
    const dataAvailable = rememberedFilter?.map(optionArray => optionArray.options?.map(
      nestedArray => nestedArray?true:false)) || 0;//type undefined false merking pga sen rendering
    const allListValuetrue = dataAvailable.every(nestedArray => nestedArray.every(value => value));//true hvis alle listene inneholder true
    if (allListValuetrue) {//lag filtering hierarki for tilgjengelig data
      const newTreeData = rememberedFilter?.map(group => ({
        title: group.groupLabel,
        key: group.groupLabel,
        children: group.options?.map(option => ({
          title: option.includes('-') ? option.split('-')[0] : option,//tilpasser alternativ verdi data med bindestrekk for tree data
          key: `${group.groupLabel}-${option}`,
        })),
      }));
      setTreeData(newTreeData);//oppdater treeData
    }else{
      setTreeData([]);//nullstille treeData
    }
  
  }, [props.selectedDate, visible, props.readyRendering, props.data, props.checkedKeys, rememberedFilter]);


  
  return (
    <>
      <button className='filter-button'  onClick={showDrawer}>
         <FilterFilled />{/*filter ikon fra ant design */}
        Filter
      </button>
      {/*Drawer fra ant design */}
      <Drawer
        title="Filter Options"
        placement="right"
        closable={true}
        onClose={onClose}
        open={visible}
      >
        {/*Tree fra ant design */}
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={props.checkedKeys}
          treeData={treeData}
        />
      </Drawer>
    </>
  );
};

export default FilterDrawer;

