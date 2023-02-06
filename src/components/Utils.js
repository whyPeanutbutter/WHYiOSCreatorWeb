
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
        "bottom": "make.bottom.equalTo(@-0);",
        "width": "make.width.equalTo(@0);",
        "height": "make.height.equalTo(@0);",
        "edges": "make.edges.equalTo(@0);",
        "size": "make.size.equalTo(@16);",
        "centerX": "make.centerX.equalTo(@0);",
        "centerY": "make.centerY.equalTo(@0);",
        "center": "make.center.equalTo(@0);",
        "left-View": "make.left.equalTo(<#view#>.mas_right).offset(0);",
        "top-View": "make.top.equalTo(<#view#>.mas_bottom).offset(0);",
        "right-View": "make.right.equalTo(<#view#>.mas_left).offset(-0);"
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

export const getAttributedText = (name, attributedTextSettings) => {
    if (attributedTextSettings.length == 0) {
        return ''
    }

    let dict = {
        "init": `NSString * titleString = <#content#>;\nNSMutableAttributedString *${name} = [[NSMutableAttributedString alloc] initWithString:titleString];\n`,
        "局部变色": `[${name} addAttribute:NSForegroundColorAttributeName value:${getColor('')} range:NSMakeRange(0, titleString.length)];\n[${name} addAttribute:NSForegroundColorAttributeName value:${getColor('')} range:NSMakeRange(0, 2)];\n`,
        "paragraphStyle": `NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];\nparagraphStyle.lineSpacing = 8;\n[${name} addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, titleString.length)];\n`,
        "局部font": `[${name} addAttribute:NSFontAttributeName value:messageLbl.font range:NSMakeRange(0, [titleString length])];\n`,
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


export const  analyViewData = (str) => {
    let dataarr = JSON.parse(str)
    console.log(dataarr);
   
    var result = {};
    if (!dataarr.length) {
        console.log("解析失败");
    return result;
    }
    let data = dataarr[0]
    result.titleName = data.baseInfo.name;
    if(data.baseInfo.radius.length > 0){
     result.conrnerRadius =  parseFloat(data.baseInfo.radius);
    }
    result.titleColor = findValueOf(data.codeInfo.codes, 'color').slice(0, -1);
    // result.titleSize = findValueOf(data.codeInfo.codes, 'font-size').replace(/[^0-9]/ig, "");
    result.titleSize =  parseFloat(findValueOf(data.codeInfo.codes, 'font-size'));
    let backgroundColor = findValueOf(data.codeInfo.codes, 'background').slice(0, -1);
    if(backgroundColor.length > 0){
        result.backgroundColor = backgroundColor;
    }
   
    return result
};

const findValueOf = (arr, key) => {
    for (const item of arr) {
        if (item.name == key) {
            return item.value;
        }
    }
    return ' '
};
