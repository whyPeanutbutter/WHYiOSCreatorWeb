
import useClipboard from "vue-clipboard3";



export const typeOptions = () => {

    return [
        'UIView',
        'UIButton',
        'UILabel',
        'UIImageView',
        'UIScrollView',
        'UITableView',
        'UITableViewCell',
        'UICollectionView',
        'UITextView',
        'UITextField'
    ];
}

export const getStorage = (key) => {
    const inputVal = localStorage.getItem(key) || ''
    if(!inputVal){
        return ''
    }
    return JSON.parse(inputVal);
}

export const setStorage = (key, obj) => {
    localStorage.setItem(key, JSON.stringify(obj))
}

export const getMansorys = (mansorys,frame=[0,0,0,0]) => {
    if (mansorys.length == 0) {
        return ''
    }
    if(frame.length < 4){
        frame = [0,0,0,0]
    }
    
    var re = ''
    let dict = {
        "left": `make.left.equalTo(@${frame[0]});`,
        "right": "make.right.equalTo(@-0);",
        "top": `make.top.equalTo(@${frame[1]});`,
        "bottom": "make.bottom.equalTo(@-0);",
        "width": `make.width.equalTo(@${frame[2]});`,
        "height": `make.height.equalTo(@${frame[3]});`,
        "edges": "make.edges.equalTo(@0);",
        "size": `make.size.equalTo(@${frame[2]});`,
        "centerX": "make.centerX.equalTo(@0);",
        "centerY": "make.centerY.equalTo(@0);",
        "center": "make.center.equalTo(@0);",
        "left-View": "make.left.equalTo(<#view#>.mas_right).offset(0);",
        "top-View": "make.top.equalTo(<#view#>.mas_bottom).offset(0);",
        "right-View": "make.right.equalTo(<#view#>.mas_left).offset(-0);",
        "bottom-View": "make.bottom.equalTo(<#view#>.mas_bottom).offset(-0);"
    };
    if (!getStorage('isOCTag')) {
        dict = {
            "left": `make.left.equalTo(${frame[0]})`,
            "right": "make.right.equalTo(-0)",
            "top": `make.top.equalTo(${frame[1]})`,
            "bottom": "make.bottom.equalTo(-0)",
            "width": `make.width.equalTo(${frame[2]})`,
            "height": `make.height.equalTo(${frame[3]})`,
            "edges": "make.edges.equalTo(0)",
            "size": `make.size.equalTo(${frame[2]})`,
            "centerX": "make.centerX.equalTo(0)",
            "centerY": "make.centerY.equalTo(0)",
            "center": "make.center.equalTo(0)",
            "left-View": "make.left.equalTo(<#view#>.snp.right).offset(0)",
            "top-View": "make.top.equalTo(<#view#>.snp.bottom).offset(0)",
            "right-View": "make.right.equalTo(<#view#>.snp.left).offset(-0)",
            "bottom-View": "make.bottom.equalTo(<#view#>.snp.bottom).offset(-0)"
        };

    }
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
    var fontSetting = getStorage('fontSetting');
    if(!fontSetting || fontSetting.length == ''){
        fontSetting = {
            left:'[UIFont systemFontOfSize:',
            right:']'
        }
        setStorage('fontSetting',fontSetting)
    }
    
    return `${fontSetting.left}${font}${fontSetting.right}`

}

export const getImage = (font) => {
    var imageSetting = getStorage('imageSetting');
    if(!imageSetting || imageSetting.length == ''){
        imageSetting = {
            left:'[UIImage imageNamed: @"',
            right:'"]'
        }
        setStorage('imageSetting',imageSetting)
    }
    
    return `${imageSetting.left}${font}${imageSetting.right}`

}


export const getColor = (color) => {
    var colorSetting = getStorage('colorSetting');
    if(!colorSetting || colorSetting.length == ''){
        colorSetting = {
            left:'[UIColor colorWithHexString:@"',
            right:'"]'
        }
        setStorage('colorSetting',colorSetting)
    }
    
    return `${colorSetting.left}${color}${colorSetting.right}`

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
        "init": `NSString * titleString = <#content#>;\nNSMutableAttributedString *${name} = [[NSMutableAttributedString alloc] initWithString:titleString];\nNSRange range = [content rangeOfString:heightLightcontent];\n`,
        "插入图片": `NSTextAttachment *attchment = [[NSTextAttachment alloc]init];\n    attchment.bounds = CGRectMake(0, -6, 20, 20);\n    attchment.image = [UIImage imageNamed:@"ITLinkIcon"];\n    NSAttributedString *string = [NSAttributedString attributedStringWithAttachment:attchment];\n    [${name} insertAttributedString:string atIndex:0];\n`,
        "局部变色": `[${name} addAttribute:NSForegroundColorAttributeName value:${getColor('')} range:NSMakeRange(0, titleString.length)];\n[${name} addAttribute:NSForegroundColorAttributeName value:${getColor('')} range:NSMakeRange(0, 2)];\n`,
        "paragraphStyle": `NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];\nparagraphStyle.lineSpacing = 8;\n//段落间距 \nparagraph.paragraphSpacing = 20;\n[paragraphStyle setFirstLineHeadIndent:32];//首行缩进\n//调整全部文字的缩进像素 paragraph.headIndent = 10;\n[${name} addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, titleString.length)];\n`,
        "局部font": `[${name} addAttribute:NSFontAttributeName value:messageLbl.font range:NSMakeRange(0, [titleString length])];\n`,
        "中划线": ` [${name} addAttribute:NSStrikethroughStyleAttributeName value:[NSNumber numberWithInteger:NSUnderlineStyleSingle] range:{0,[titleString length]}];//中划线 [btn setAttributedTitle:${name} forState:UIControlStateNormal];`,
        "下划线": ` [${name} addAttribute:NSUnderlineStyleAttributeName value:[NSNumber numberWithInteger:NSUnderlineStyleSingle] range:{0,[titleString length]}];//下划线 [btn setAttributedTitle:${name} forState:UIControlStateNormal];`,
        "其他": `NSString *str2 = @"设置字体背景颜色\n";\nNSDictionary *dictAttr2 = @{NSBackgroundColorAttributeName:[UIColor cyanColor]};\nNSAttributedString *attr2 = [[NSAttributedString alloc]initWithString:str2 attributes:dictAttr2];\n[attributedString appendAttributedString:attr2];\n\n/*!\n 注：NSKernAttributeName用来设置字符之间的间距，取值为NSNumber对象（整数），负值间距变窄，正值间距变宽\n */   \n \nNSString *str4 = @"\n设置字符间距";   \nNSDictionary *dictAttr4 = @{NSKernAttributeName:@(4)};\nNSAttributedString *attr4 = [[NSAttributedString alloc]initWithString:str4 attributes:dictAttr4];\n[attributedString appendAttributedString:attr4];\n\n/*!\n NSStrokeWidthAttributeName 设置笔画的宽度，取值为NSNumber对象（整数），负值填充效果，正值是中空效果。NSStrokeColorAttributeName  设置填充部分颜色，取值为UIColor对象。\n 设置中间部分颜色可以使用 NSForegroundColorAttributeName 属性来进行\n */   \n  \nNSString *str6 = @"设置笔画宽度和填充颜色\n";\nNSDictionary *dictAttr6 = @{NSStrokeWidthAttributeName:@(2),NSStrokeColorAttributeName:[UIColor blueColor]};\nNSAttributedString *attr6 = [[NSAttributedString alloc]initWithString:str6 attributes:dictAttr6];\n[attributedString appendAttributedString:attr6];\n\nNSString *str7 = @"设置阴影属性\n";\nNSShadow *shadow = [[NSShadow alloc]init];\nshadow.shadowColor = [UIColor redColor];\nshadow.shadowBlurRadius = 1.0f;\nshadow.shadowOffset = CGSizeMake(1, 1);\nNSDictionary *dictAttr7 = @{NSShadowAttributeName:shadow};\nNSAttributedString *attr7 = [[NSAttributedString alloc]initWithString:str7 attributes:dictAttr7];\n[attributedString appendAttributedString:attr7];\n\n/*!\n NSBaselineOffsetAttributeName 设置基线偏移值\n取值为NSNumber （float），正值上偏，负值下偏\n */     \n\nNSString *str11 = @"添加基线偏移值\n";\nNSDictionary *dictAttr11 = @{NSBaselineOffsetAttributeName:@(-10)};\nNSAttributedString *attr11 = [[NSAttributedString alloc]initWithString:str11 attributes:dictAttr11];\n[attributedString appendAttributedString:attr11];\n\n/*!\nNSObliquenessAttributeName 设置字体倾斜度\n取值为 NSNumber（float），正值右倾，负值左倾\n*/   \n\nNSString *str12 = @"设置字体倾斜度\n";\nNSDictionary *dictAttr12 = @{NSObliquenessAttributeName:@(0.5)};\nNSAttributedString *attr12 = [[NSAttributedString alloc]initWithString:str12 attributes:dictAttr12];\n[attributedString appendAttributedString:attr12];\n\n/*!\nNSExpansionAttributeName 设置字体的横向拉伸，取值为NSNumber （float），正值拉伸 ，负值压缩\n*/   \n   \nNSString *str13 = @"设置字体横向拉伸\n";\nNSDictionary *dictAttr13 = @{NSExpansionAttributeName:@(0.5)};\nNSAttributedString *attr13 = [[NSAttributedString alloc]initWithString:str13 attributes:dictAttr13];\n[attributedString appendAttributedString:attr13];\n\n/*!\n NSWritingDirectionAttributeName 设置文字的书写方向，取值为以下组合\n @[@(NSWritingDirectionLeftToRight | NSWritingDirectionEmbedding)]\n @[@(NSWritingDirectionLeftToRight | NSWritingDirectionOverride)]\n @[@(NSWritingDirectionRightToLeft | NSWritingDirectionEmbedding)]\n @[@(NSWritingDirectionRightToLeft | NSWritingDirectionOverride)]\n*/     \n  \nNSString *str14 = @"设置文字书写方向\n";\nNSDictionary *dictAttr14 = @{NSWritingDirectionAttributeName:@[@(NSWritingDirectionRightToLeft | NSWritingDirectionEmbedding)]};\nNSAttributedString *attr14 = [[NSAttributedString alloc]initWithString:str14 attributes:dictAttr14];\n[attributedString appendAttributedString:attr14];\n\n/*!\n NSVerticalGlyphFormAttributeName 设置文字排版方向\n 取值为NSNumber对象（整数），0表示横排文本，1表示竖排文本  在iOS中只支持0\n */     \nNSString *str15 = @"设置文字排版方向\n";\nNSDictionary *dictAttr15 = @{NSVerticalGlyphFormAttributeName:@(0)};\nNSAttributedString *attr15 = [[NSAttributedString alloc]initWithString:str15 attributes:dictAttr15];\n[attributedString appendAttributedString:attr15];\n`,
    };


    if (!getStorage('isOCTag')) {
        dict = {
            "init": `let titleString = "<#content#>"\nvar ${name} = NSMutableAttributedString(string: titleString)\n`,
            "插入图片": `let attachment = NSTextAttachment()\nattachment.bounds = CGRect(x: 0, y: -6, width: 20, height: 20)\nattachment.image = UIImage(named: "ITLinkIcon")\nlet attachmentString = NSAttributedString(attachment: attachment)\n${name}.insert(attachmentString, at: 0)\n`,
            "局部变色": `${name}.addAttribute(NSAttributedString.Key.foregroundColor, value: ${getColor('')}, range: NSRange(location: 0, length: titleString.count))\n${name}.addAttribute(NSAttributedString.Key.foregroundColor, value: ${getColor('')}, range: NSRange(location: 0, length: 2))\n`,
            "paragraphStyle": `let paragraphStyle = NSMutableParagraphStyle()\nparagraphStyle.lineSpacing = 8\nparagraphStyle.paragraphSpacing = 20\nparagraphStyle.firstLineHeadIndent = 32\n${name}.addAttribute(NSAttributedString.Key.paragraphStyle, value: paragraphStyle, range: NSRange(location: 0, length: titleString.count))\n`,
            "局部font": `${name}.addAttribute(NSAttributedString.Key.font, value: messageLbl.font, range: NSRange(location: 0, length: titleString.count))\n`,
            "中划线": `${name}.addAttribute(NSAttributedString.Key.strikethroughStyle, value: NSUnderlineStyle.single.rawValue, range: NSRange(location: 0, length: titleString.count))\n`,
            "下划线": `${name}.addAttribute(NSAttributedString.Key.underlineStyle, value: NSUnderlineStyle.single.rawValue, range: NSRange(location: 0, length: titleString.count))\n`,
            "其他":`import UIKit\n\nlet attributedString = NSMutableAttributedString()\n\n// Setting font background color\nlet str2 = "设置字体背景颜色\n"\nlet dictAttr2: [NSAttributedString.Key: Any] = [.backgroundColor: UIColor.cyan]\nlet attr2 = NSAttributedString(string: str2, attributes: dictAttr2)\nattributedString.append(attr2)\n\n// Setting character kerning (spacing)\nlet str4 = "\n设置字符间距"\nlet dictAttr4: [NSAttributedString.Key: Any] = [.kern: 4]\nlet attr4 = NSAttributedString(string: str4, attributes: dictAttr4)\nattributedString.append(attr4)\n\n// Setting stroke width and color\nlet str6 = "设置笔画宽度和填充颜色\n"\nlet dictAttr6: [NSAttributedString.Key: Any] = [.strokeWidth: 2, .strokeColor: UIColor.blue]\nlet attr6 = NSAttributedString(string: str6, attributes: dictAttr6)\nattributedString.append(attr6)\n\n// Setting shadow attributes\nlet str7 = "设置阴影属性\n"\nlet shadow = NSShadow()\nshadow.shadowColor = UIColor.red\nshadow.shadowBlurRadius = 1.0\nshadow.shadowOffset = CGSize(width: 1, height: 1)\nlet dictAttr7: [NSAttributedString.Key: Any] = [.shadow: shadow]\nlet attr7 = NSAttributedString(string: str7, attributes: dictAttr7)\nattributedString.append(attr7)\n\n// Setting baseline offset\nlet str11 = "添加基线偏移值\n"\nlet dictAttr11: [NSAttributedString.Key: Any] = [.baselineOffset: -10]\nlet attr11 = NSAttributedString(string: str11, attributes: dictAttr11)\nattributedString.append(attr11)\n\n// Setting font obliqueness\nlet str12 = "设置字体倾斜度\n"\nlet dictAttr12: [NSAttributedString.Key: Any] = [.obliqueness: 0.5]\nlet attr12 = NSAttributedString(string: str12, attributes: dictAttr12)\nattributedString.append(attr12)\n\n// Setting font expansion (horizontal stretch)\nlet str13 = "设置字体横向拉伸\n"\nlet dictAttr13: [NSAttributedString.Key: Any] = [.expansion: 0.5]\nlet attr13 = NSAttributedString(string: str13, attributes: dictAttr13)\nattributedString.append(attr13)\n\n// Setting writing direction\nlet str14 = "设置文字书写方向\n"\nlet dictAttr14: [NSAttributedString.Key: Any] = [.writingDirection: [NSNumber(value: NSWritingDirection.rightToLeft.rawValue | NSWritingDirectionFormatType.embedding.rawValue)]]\nlet attr14 = NSAttributedString(string: str14, attributes: dictAttr14)\nattributedString.append(attr14)\n\n// Setting vertical glyph form (iOS supports only horizontal text)\nlet str15 = "设置文字排版方向\n"\nlet dictAttr15: [NSAttributedString.Key: Any] = [.verticalGlyphForm: 0]\nlet attr15 = NSAttributedString(string: str15, attributes: dictAttr15)\nattributedString.append(attr15)\n\n`
        };
    }
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
    if (str.indexOf('"baseInfo"') > 0) {
        //nothing
    } else if (str.indexOf('alloc] init]') > 0) {
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
        result.cornerRadius = parseFloat(data.baseInfo.radius);
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
    var result = /initWithString:@"(.*?)"/g.exec(code);
    if (result) {
        data.titleName = result[1];
    }

    result = /.cornerRadius = \d+(\.\d+)?;/g.exec(code);
    if (result) {
        var num = /\d+(\.\d+)?/g.exec(result);
        console.log(num + 'aaaaaaaaaaa');
        data.cornerRadius = num[0];
    }

    result = /NSForegroundColorAttributeName: \[UIColor colorWithRed:(\w+)\/255.0 green:(\w+)\/255.0 blue:(\w+)\/255/.exec(code);
    if (result) {
        data.titleColor = rgbToHex(`rgb(${result[1]},${result[2]},${result[3]})`);
    }

    //按照最少字符串匹配 'size:'和'],'之间的数字
    result = /size: (\d+(\.\d+)?)],/g.exec(code);
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
/// 匹配字符串frame = CGRectMake();中的数字保留下来，按逗号输出为数组
    result = /frame = CGRectMake\((.*),(.*),(.*),(.*)\);/g.exec(code);
    if (result) {
        data.frame = [result[1], result[2], result[3], result[4]];
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

