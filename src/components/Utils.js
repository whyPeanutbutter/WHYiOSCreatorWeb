
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
        "left-View": "make.left.equalTo(<#view#>.mas_right).offset(0);",
        "top-View": "make.top.equalTo(<#view#>.mas_bottom).offset(0);",
        "right-View": "make.right.equalTo(<#view#>.mas_left).offset(0);"
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


export const analyViewData = (str) => {
    if (str.indexOf('alloc] init]') > 0) {
        return analyOCCode(str);
    }
    let dataarr = JSON.parse(str)
    console.log(dataarr);

    var result = {};
    if (!dataarr.length) {
        console.log("解析失败");
        return result;
    }
    let data = dataarr[0]
    result.titleName = data.baseInfo.name;
    if (data.baseInfo.radius.length > 0) {
        result.conrnerRadius = parseFloat(data.baseInfo.radius);
    }
    result.titleColor = findValueOf(data.codeInfo.codes, 'color').slice(0, -1);
    // result.titleSize = findValueOf(data.codeInfo.codes, 'font-size').replace(/[^0-9]/ig, "");
    result.titleSize = parseFloat(findValueOf(data.codeInfo.codes, 'font-size'));
    let backgroundColor = findValueOf(data.codeInfo.codes, 'background').slice(0, -1);
    if (backgroundColor.length > 0) {
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

const analyOCCode = (code) => {
    var data = {}
    var result = /ng alloc] initWithString:@"(.*)"/g.exec(code);
    if (result) {
        data.titleName = result[1];
    }

    result = /.cornerRadius =(\w+);/g.exec(code);
    if (result) {
        data.conrnerRadius = result[1];
    }

    result = /NSForegroundColorAttributeName: \[UIColor colorWithRed:(\w+)\/255.0 green:(\w+)\/255.0 blue:(\w+)\/255/.exec(code);
    if (result) {
        data.backgroundColor = rgbToHex(`rgb(${result[1]},${result[2]},${result[3]})`);
    }

    result = /size: (.*)],/g.exec(code); 
    console.log(result)
    if (result) {
        data.titleSize = result[1];
    }

    result = /backgroundColor = \[UIColor colorWithRed:(\w+)\/255.0 green:(\w+)\/255.0 blue:(\w+)\/255.0/g.exec(code);
    if (result) {
        data.backgroundColor = rgbToHex(`rgb(${result[1]},${result[2]},${result[3]})`);
    }

    result = /borderColor = \[UIColor colorWithRed:(\w+)\/255.0 green:(\w+)\/255.0 blue:(\w+)\/255.0/g.exec(code);
    if (result) {
        data.borderColor = rgbToHex(`rgb(${result[1]},${result[2]},${result[3]})`);
    }
    return data;
}


const rgbToHex = (rgb) => {
    if (!/^(rgb|RGB)/.test(rgb)) {
        return rgb;//如果输入不是rgb(xx,xx,xx)的格式，直接返回
    }
    //参数rgb是字符串形式的'rgb(xx,xx,xx)'
    var color = rgb.toString().match(/\d+/g);//将参数中的数值提取出来放在数组中
    var hex = '#';
    for (var i = 0; i < 3; i++) {
        /**
        ** 这里有三个地方需要注意，首先如果转换为16进制以后是个位数，需要前面补0，凑足两个数位
        ** 其次toString(16)转换的前提条件是数值类型，需要Number()
        ** 方法转换，或者使用+转换也可以；最后使用slice(-2)方法取得最后面两个字符，这样可以去掉多余的0
        **/
        if (color[i] < 0 || color[i] > 255) {//处理值不符合的数值，比如256就直接返回了
            return rgb;
        }
        hex += ('0' + Number(color[i]).toString(16)).slice(-2);
    }
    return hex;
}

