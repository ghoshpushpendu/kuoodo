import LocalizedStrings from 'localized-strings';


export var strings = new LocalizedStrings({
    english: {
        /** registration page **/
        signIn: 'Sign In',
        signInHelpText: 'Mobile no without country code',
        forgot: 'Forgot',
        password: 'password',
        enter: 'enter',
        pleaseWait: 'Please wait',
        wrongCredentials: 'wrong credentials',
        /** O.T.P Page **/
        otpEmptyMessage: 'OTP can not be empty',
        verification: 'verification',
        resend: 'resend',
        completed: 'completepleaseWait',
        verify: 'Verify',
        notGotOTP: 'Did not pleaseWaitet your',
        agreeMessage: 'By Continuing, I confirm that I have read and agree to the',
        termsAndConditions: 'Terms & Conditions',
        privacyPolicy: 'Privacy Policy',
        and: 'and',

        /** profile info page **/

        validEmail: 'enter a valid email address',
        enterFName: "Please enter your first name",
        enterLName: "Please enter your last name",
        enterEmail: "Please enter your email",
        enterPassword: "Please enter your password",
        passwordLength: "Password should contain at least 8 digit",
        profileInformation: "Profile information",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        mobileNumber: "Mobile Number",

        /** O.T.P Screen page **/
        wrongOTP: "Wrong O.T.P",
        send: "send",


        /** reset password page **/
        reset: "Reset",
        enterNPassword: "Enter new password",
        confirmNPassword: "COnfirm new password",
        change: "Change",
        passwordSuccess: "Password reset successfull",
        passwordMismatch: "Passwords do not match",

        /** trip histor page **/
        noTrip: "You don't have any trip yet",

        /** Profile page **/
        personalInfo: "Personal Info",
        name: "Name",
        fetchingProfile: "Fetching profile data",

        /** Payment page **/
        payment: "payment",
        pendingAmount: "Payment pending",
        pay: "Pay",
        savedCards: " Saved Cards",
        addCard: "Add payment method",
        cardError: "can not get card",
        deleteError: "Remove the linked card to add a new one",
        deleteHttpError: "can not get card",
        deleteSuccess: "card has been deleted",
        paymentError: "Error processing payment",
        paymentSuccess: "Successfully paid. Thank you.",

        /** add card page **/
        addcard: "Add new Card",
        cardNumber: "Card Number",
        expMonth: "Expiration month",
        expYear: "expiration year ",
        country: "Country",
        cardAddError: "Can not add card",
        cardAddSuccess: "Card added successfully",

        /** find car page **/
        driverInfo: "Driver Info",
        driverDistance: "Driver distance",
        timeToArrive: "Time to arrive",
        locationFrom: "location from",
        locationTo: "location to",
        otpMsg: "Provide the driver this code while starting ride ",
        cabType: "Choose Cab Type",
        bookBtn: "REQUEST CAB",
        fetchLocation: "fetching pickup location",
        accepted: "Ride request has been accepted",
        rejected: "Ride request has been rejected",
        arrived: "Driver has arrived",
        rideStarted: "Ride has been started",
        rideCompleted: "Ride has completed",
        paymentMethodError: "Please add a payment method to book ride",
        noCardError: "can not get card",
        noPickUp: "No pickup location",
        noDropOff: "No drop off location",
        selectCar: "Select a car type to book",
        searchingDriver: "Searching and booking driver",
        serverError: "Server error . Try again",
        driverConfirmation: "Please wait for driver confirmation",
        updateError: "Can not update status",
        onlineStatus: "You are now",
        notAvailable: "is not available here",
        gettingPayments: "Getting pending payments",
        gettingCards: "Getting cards",
        makingPayment: "Making the payment",
        profile: "Profile",
        tripHistory: "Trip History",
        payments: "Payment",
        logout: "Logout"
    },
    spanish: {
        /** registration page **/
        signIn: 'registrarse',
        signInHelpText: 'número de móvil sin código de país',
        forgotPassword: 'Se te olvidó tu contraseña ?',
        forgot: 'olvidó',
        password: 'contraseña',
        enter: 'entrar',
        pleaseWait: 'por favor espera',
        wrongCredentials: 'credenciales incorrectas',
        /** O.T.P Page **/
        otpEmptyMessage: 'otp no puede estar vacío',
        verification: 'verificación',
        resend: 'reenviar',
        completed: 'terminado',
        verify: 'Verificar',
        notGotOTP: 'No consiguió su',
        agreeMessage: 'Continuando, confirmo que he leído y acepto la',
        termsAndConditions: 'Términos y condiciones',
        privacyPolicy: 'Política de privacidad',
        and: 'y',

        /** profile info page **/

        validEmail: "Introduzca una dirección de correo electrónico válida",
        enterFName: "Por favor, introduzca su nombre de pila",
        enterLName: "Por favor ingrese su apellido",
        enterEmail: "Por favor introduzca su correo electrónico",
        enterPassword: "Por favor, introduzca su contraseña",
        passwordLength: "La contraseña debe contener al menos 8 dígitos",
        profileInformation: "información del perfil",
        firstName: "nombre de pila",
        lastName: "apellido",
        email: "correo electrónico",
        mobileNumber: "número de teléfono móvil",

        /** O.T.P Screen page **/
        wrongOTP: "Wrong O.T.P",
        send: "enviar",

        /** reset password page **/
        reset: "Reiniciar",
        enterNPassword: "Introduzca nueva contraseña",
        confirmNPassword: "Confirmar nueva contraseña",
        change: "Cambio",
        passwordSuccess: "Contraseña restablecida con éxito",
        passwordMismatch: "Las contraseñas no coinciden",

        /** trip histor page **/
        noTrip: "Aún no tienes ningún viaje.",

        /** Profile page **/
        personalInfo: "Información personal",
        name: "Nombre",
        fetchingProfile: "Obteniendo datos de perfil",

        /** Payment page **/
        /** Payment page **/
        payment: "pago",
        pendingAmount: "Pago pendiente",
        pay: "Paga",
        savedCards: "Tarjetas guardadas",
        addCard: "Añadir método de pago",
        cardError: "no puedo obtener la tarjeta",
        deleteError: "Retira la tarjeta vinculada para agregar una nueva.",
        deleteHttpError: "no puedo obtener la tarjeta",
        deleteSuccess: "la tarjeta ha sido borrada",
        paymentError: "Error al procesar el pago",
        paymentSuccess: "Con éxito pagado Gracias.",

        /** add card page **/
        addcard: "Añadir nueva tarjeta",
        cardNumber: "Número de tarjeta",
        expMonth: "Mes de expiración",
        expYear: "año de vencimiento ",
        country: "País",
        cardAddError: "No se puede agregar la tarjeta",
        cardAddSuccess: "Tarjeta agregada exitosamente",

        /** find car page **/
        driverInfo: "Información del conductor",
        driverDistance: "Distancia del conductor",
        timeToArrive: "Hora de llegar",
        locationFrom: "ubicación desde",
        locationTo: "ubicación para",
        otpMsg: "Proporcione al conductor este código al iniciar el recorrido.",
        cabType: "Elija el tipo de cabina",
        bookBtn: "SOLICITAR CAB",
        fetchLocation: "recogiendo el lugar de recogida",
        accepted: "Solicitud de viaje ha sido aceptada",
        rejected: "Ride request has been rejected",
        arrived: "El conductor ha llegado",
        rideStarted: "Ride se ha iniciado",
        rideCompleted: "Ride ha completado",
        paymentMethodError: "Por favor agregue un método de pago para reservar paseo",
        noCardError: "no puedo obtener la tarjeta",
        noPickUp: "No hay lugar de recogida",
        noDropOff: "No hay lugar de entrega",
        selectCar: "Seleccione un tipo de auto para reservar",
        searchingDriver: "Conductor de búsqueda y reserva.",
        serverError: "Error del Servidor . Inténtalo de nuevo",
        driverConfirmation: "Por favor, espere la confirmación del conductor",
        updateError: "No se puede actualizar el estado",
        onlineStatus: "Ahora estas",
        notAvailable: "no está disponible aquí",
        gettingPayments: "Obtener pagos pendientes",
        gettingCards: "Obteniendo tarjetas",
        makingPayment: "Haciendo el pago",
        profile: "Perfil",
        tripHistory: "Historia de viaje",
        payments: "Pago",
        logout: "Cerrar sesión"
    },
    chineese: {
        /** registration page **/
        signIn: '登入',
        signInHelpText: '没有国家代码的手机号码',
        forgotPassword: '忘记密码 ？',
        forgot: '忘记',
        password: '密码',
        enter: '输入',
        pleaseWait: '请耐心等待',
        wrongCredentials: '错误的凭据',
        /** O.T.P page **/
        otpEmptyMessage: 'otp不能为空',
        verification: '验证',
        resend: '重发',
        completed: '完成',
        verify: '校验',
        notGotOTP: '没得到你的',
        agreeMessage: '通过继续，我确认我已阅读并同意',
        termsAndConditions: '条款和条件',
        privacyPolicy: '隐私政策',
        and: '和',

        /** profile info page **/

        validEmail: "输入一个有效的电子邮件地址",
        enterFName: "请输入您的名字",
        enterLName: "请输入您的姓氏",
        enterEmail: "请输入您的电子邮件",
        enterPassword: "请输入您的密码",
        passwordLength: "密码至少应包含8位数字",
        profileInformation: "档案信息",
        firstName: "名字",
        lastName: "姓",
        email: "电子邮件",
        mobileNumber: "手机号码",

        /** O.T.P Screen page **/
        wrongOTP: "Wrong O.T.P",
        send: "发送",


        /** reset password page **/
        reset: "重启",
        enterNPassword: "输入新密码",
        confirmNPassword: "确认新密码",
        change: "更改",
        passwordSuccess: "密码重置成功",
        passwordMismatch: "密码不匹配",

        /** trip histor page **/
        noTrip: "你还没有旅行",

        /** Profile page **/
        personalInfo: "个人信息",
        name: "名称",
        fetchingProfile: "获取配置文件数据",

        /** Payment page **/
        payment: "付款",
        pendingAmount: "待付款",
        pay: "支付",
        savedCards: "保存卡",
        addCard: "添加付款方式",
        cardError: "我拿不到卡",
        deleteError: "删除链接的卡以添加新卡。",
        deleteHttpError: "我拿不到卡",
        deleteSuccess: "卡已被删除",
        paymentError: "处理付款时出错",
        paymentSuccess: "成功付款谢谢。",

        /** add card page **/
        addcard: "添加新卡",
        cardNumber: "卡号",
        expMonth: "到期月份",
        expYear: "到期年份",
        country: "国家",
        cardAddError: "无法添加卡",
        cardAddSuccess: "卡添加成功",

        /** find car page **/
        driverInfo: "卡添加成功",
        driverDistance: "司机距离",
        timeToArrive: "是时候到了",
        locationFrom: "来自的位置",
        locationTo: "位置",
        otpMsg: "在开始骑行时为驾驶员提供此代码",
        cabType: "选择驾驶室类型",
        bookBtn: "请求CAB",
        fetchLocation: "f蚀刻拾取位置",
        accepted: "乘车请求已被接受",
        rejected: "乘车请求已被拒绝",
        arrived: "司机到了",
        rideStarted: "骑行已经开始了",
        rideCompleted: "骑行已经完成",
        paymentMethodError: "请添加付款方式以预订",
        noCardError: "得不到卡",
        noPickUp: "没有取件位置",
        noDropOff: "没有下车的位置",
        selectCar: "选择要预订的汽车类型",
        searchingDriver: "搜索和预订司机",
        serverError: "服务器错误 。再试一次",
        driverConfirmation: "请等待司机确认",
        updateError: "无法更新状态",
        onlineStatus: "你现在",
        notAvailable: "这里没有",
        gettingPayments: "等待付款",
        gettingCards: "获得卡片",
        makingPayment: "付款",
        profile: "轮廓",
        tripHistory: "旅行历史",
        payments: "付款",
        logout: "登出"
    }
},
    {/* options */
        customLanguageInterface: () => {
            return localStorage.getItem('language')
        }
    }
);