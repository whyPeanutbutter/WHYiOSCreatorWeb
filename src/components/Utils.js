
import useClipboard from "vue-clipboard3";


export const getMansorys = (mansorys) => {
    if (mansorys.length == 0) {
        return ''
    }
    var re = ''
    let dict = {
        "left": "make.left.equalTo(@16);",
        "right": "make.right.equalTo(@-16);",
        "top": "make.top.equalTo(@16);",
        "bottom": "make.bottom.equalTo(@0);",
        "width": "make.width.equalTo(@0);",
        "height": "make.height.equalTo(@0);",
        "edges": "make.edges.equalTo(@0);",
        "size": "make.size.equalTo(@16);",
        "centerX": "make.centerX.equalTo(@0);",
        "centerY": "make.centerY.equalTo(@0);",
        "center": "make.center.equalTo(@0);",
        "left-view": "make.left.equalTo(<#view#>.mas_right).offset(0);",
        "top-view": "make.top.equalTo(<#view#>.mas_bottom).offset(0);"
    };
    var i = 0
    for (let str of mansorys) {
        re = re + (mansorys.indexOf(str) > -1 ? dict[str] : '')
        if (i != mansorys.length - 1) {
            re = re + '\n'
        }
        i++;
    }
    return re

}

export const getFont = (font) => {
    return `[UIFont systemFontOfSize:${font}]`

}

export const getColor = (color) => {

    return `[ColorUtility colorWithString:@"${color}"]`

}


const { toClipboard } = useClipboard();
export const copy = async (text) => {
    try {
        await toClipboard(text);  //实现复制
        // alert("复制成功");
        console.log("Success");
    } catch (e) {
        console.error(e);
        alert("复制fail");
    }
};

export const getAttributedText = (name,attributedTextSettings) => {
    if (attributedTextSettings.length == 0) {
        return ''
    }
   
    let dict = {
        "init": `NSStering * titleString = <#content#>;\nNSMutableAttributedString *${name} = [[NSMutableAttributedString alloc] initWithString:titleString];`,
    "局部变色": `[${name} addAttribute:NSForegroundColorAttributeName value:${getColor('')} range:NSMakeRange(0, titleString.length)];\n[${name} addAttribute:NSForegroundColorAttributeName value:${getColor('')} range:NSMakeRange(0, 2)];`,
    "paragraphStyle": `NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];\nparagraphStyle.lineSpacing = 8;\n[${name} addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, titleString.length)];`,
    "局部font": `[${name} addAttribute:NSFontAttributeName value:messageLbl.font range:NSMakeRange(0, [titleString length])];`,
    };
    var re = dict['init'];
    var i = 0
    for (let str of attributedTextSettings) {
        re = re + (attributedTextSettings.indexOf(str) > -1 ? dict[str] : '')
        if (i != attributedTextSettings.length - 1) {
            re = re + '\n'
        }
        i++;
    }
    return re
};
