import styles from './nested-dropdown.module.css';
import { Utilities } from '../../assets';
import React from 'react';
import Draggable from 'react-draggable';

const NestedSidenavDropdown = () => {
    return (
    
         <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
            >
                <div>
                    <ul>
                        <li className={`${styles['dropdown-lists']} ${styles.active}`}>
                            <div className={styles.dropdownIcons}>
                            <img className={styles.right} src={Utilities.right} />
                            <img src={Utilities.folder} />
                            <div className={`${styles['icon-descriptions']} ${styles.active}`}>
                                <span>Architecture</span>
                            </div>
                            </div>
                            <div className={styles['list1-right-contents']}>
                            <span>396</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </Draggable>
        )
    };

export default NestedSidenavDropdown;