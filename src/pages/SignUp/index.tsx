import React,{useRef, useCallback} from 'react';
import {Image,View, KeyboardAvoidingView, Platform, ScrollView,TextInput,Alert} from 'react-native';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Form} from '@unform/mobile';
import api from '../../services/api';
import {FormHandles} from '@unform/core';
import {Container,Title, BackToSignInButton, BackToSignInButtonText} from './styles';
import * as Yup from 'yup';
import getValidateErrors from '../../utils/getValidadeErrors';

interface signUpFormData {
    name:string;
    email:string;
    password:string;
}
const SignUp: React.FC = () => {
    const navigation =  useNavigation();

    const passwordInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const formRef = useRef<FormHandles>(null);

    const handleSignUp = useCallback(async (data:signUpFormData) => {
        try{

            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name:Yup.string().required('Nome é obrigatório'),
                email:Yup.string().required('Email é obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });

            await schema.validate(data, {
                abortEarly:false,
            });

            await api.post('users', data)

            navigation.goBack();

            Alert.alert('Cadastro realizado com sucesso !','Você já pode fazer login na aplicação');
        }catch(err){

            if(err instanceof Yup.ValidationError){
                const errors = getValidateErrors(err);

                formRef.current?.setErrors(errors);
            }

            Alert.alert('Erro no cadastro','Ocorreu um erro ao fazer cadastro, tente novamente');
        }
    },[]);

    return (
        <>
            <KeyboardAvoidingView style={{flex:1}} 
            behavior={Platform.OS ==='ios' ? 'padding' : undefined}
            enabled> 

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex:1}}> 
                <Container>
                    <Image source={logoImg}/>
                    <View>
                        <Title>Crie sua conta</Title>
                    </View>
                    <Form ref={formRef} onSubmit={handleSignUp}>
                        <Input autoCapitalize="words" name="name" icon="user" placeholder="Nome" returnKeyType="next" onSubmitEditing={() => emailInputRef.current?.focus()}/>
                        <Input ref={emailInputRef} keyboardType="email-address" autoCorrect={false} autoCapitalize="none" name="email" icon="mail" placeholder="E-mail" returnKeyType="next" onSubmitEditing={() => passwordInputRef.current?.focus()}/>
                        <Input ref={passwordInputRef} secureTextEntry textContentType="newPassword" name="password" icon="lock" placeholder="Senha" returnKeyType="send" onSubmitEditing={()=> formRef.current?.submitForm()}/>
                        <Button onPress={()=> formRef.current?.submitForm()}>Entrar</Button>
                    </Form>
                </Container>
              </ScrollView>  
            </KeyboardAvoidingView>
            <BackToSignInButton onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#fff"/>
                <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
            </BackToSignInButton>
        </>
    );
}

export default SignUp;