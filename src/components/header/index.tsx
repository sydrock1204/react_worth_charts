import WorthChartLogo from '../../assets/WorthCharting.png'
import { BaseButton } from '../common/BaseButton'

const Header = () => {
    return (
        <div className="flex flex-row justify-between my-2">
            <div className="relative left-6">
                <img src={WorthChartLogo} width={300} height={300} alt="WorthChart" />
            </div>
            <div className="relative flex flex-row gap-2 right-[16px]">
                <BaseButton text="subscribe" className="relative h-[70%] top-[15%] bg-color-brand-green border-color-brand-green border-2 font-mono text-[20px] !p-3"/>
                <BaseButton text="login" className="relative h-[70%] top-[15%] bg-transparent border-color-brand-green border-2 font-mono text-[20px] !p-3"/>
            </div>
        </div>
    )
}

export default Header
