/*
 * @Author: gomi gxy880520@qq.com
 * @Date: 2024-11-15 21:36:54
 * @LastEditors: gomi gxy880520@qq.com
 * @LastEditTime: 2025-06-23 22:06:16
 * @FilePath: \website-next\packages\website\components\icons\X.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useTheme } from "next-themes";

export default function X(props) {
    const { theme } = useTheme();
    return (
        <div {...props}>
            <svg
                width="42"
                height="42"
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    id="形状"
                    d="M7 0C3.13397 0 0 3.13397 0 7C0 7 0 35 0 35C0 38.866 3.13397 42 7 42C7 42 35 42 35 42C38.866 42 42 38.866 42 35C42 35 42 7 42 7C42 3.13397 38.866 0 35 0C35 0 7 0 7 0C7 0 7 0 7 0ZM9.08594 9L17.0234 9L22.6602 17.0098L29.5 9L32 9L23.7891 18.6133L33.9141 33L25.9785 33L19.4375 23.707L11.5 33L9 33L18.3086 22.1035L9.08594 9L9.08594 9ZM12.9141 11L27.0215 31L30.0859 31L15.9785 11L12.9141 11L12.9141 11Z"
                    fill={"#ffffff"}
                />
            </svg>
        </div>
    );
}
