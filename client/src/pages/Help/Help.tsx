import React from 'react'
import classes from "./Help.module.css"
import ButtonIconOnly from '../../components/ButtonIconOnly/ButtonIconOnly'
import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import icons from '../../utils/icons'
import NavPanel from '../../components/NavPanel/NavPanel'
import Map from '../Map/Map'

import MapImg from "./assets/map.png"
import DemoGif from "./assets/demo.gif"
import Emph from '../../components/Emph/Emph'

const Help = () => {
  return (
    <div className={classes.container}>
        <div className={classes.header}>
            <Link to='/' className={classes.btnClose}>
                <ButtonIconOnly icon={icons.close} />
            </Link>
        </div>
        <div className={classes.content}>
            <h1>Retail Site Decision System</h1>
            <br /><hr /><br />
            <p>
                Location plays a key role in the success of a business. 
                No amount of property features such as building, decorating, or price can overcome the negative impact 
                of a poor location. A strategically positioned business not only reduces financial risks 
                but also enhances the likelihood of achieving success. This system implements a methodology to 
                assist retailers in making informed location decisions.
            </p>
            <br />
            <h2>Core Components</h2>
            <br />
            <p>
                Before diving into the system, it is important to understand what are the key 
                components:
            </p>
            <br />
            <h3>Menu</h3>
            <br />
            <p>
                The menu acts as a straightforward navigation element positioned on the left side of the screen. 
                It helps user to navigate between 3 tabs: <Emph>Site Selection Process</Emph>, <Emph>Layers</Emph> and <Emph>Help</Emph>. 
                Each tab can be found by the following icons:
            </p>
            <br />
            <ul>
                <li>
                    <Icon icon={icons.location} width={20} height={20} /> 
                    The site selection process tabs is responsible for guiding using through the process.
                </li>
                <li>
                    <Icon icon={icons.layers} width={20} height={20} />
                    Layers tab contains information about the data this system is initialized with.
                </li>
                <li>
                    <Icon icon={icons.help} width={20} height={20} />
                    Help tab displays information you are currently reading.
                </li>
            </ul>
            <br />
            <h3>Map</h3>
            <br />
            <p>
                The map serves as a central component. Upon selecting a business type, 
                the map presents users with information regarding highly competitive areas. 
                As illustrated in the screenshot below, red-colored regions indicate areas 
                where customers are more likely to travel to the nearest competitor's outlets.
            </p>
            <br />
            <img src={MapImg} />
            <br />
            <br />
            <h2>Available Data</h2>
            <br />
            <p>
                The system can be initialized with various datasets, but in the current instance,
                it depends on data sourced from <a href='https://data.brno.cz/'>data.brno</a>.
            </p>
            <br />
            <p>
                Here are the datasets that the system is utilizing:
            </p>
            <br />
            <ul>
                <li>
                    <a href='https://arcg.is/1Lfbzb0'>Number of People Living at the Addresses</a>
                </li>
                <li>
                    <a href='https://arcg.is/0CaaCS'>Brno Retail Research</a>
                </li>
            </ul>
            <br />
            <h2>How it works?</h2>
            <br/>
            <p>Below is a straightforward demonstration showcasing the complete process of selecting a location for the bakery in Brno.</p>
            <br />
            <img src={DemoGif} />
            <br />
        </div>
    </div>
  )
}

export default Help