
@echo off
:: ����ѹ��JS�ļ��ĸ�Ŀ¼���ű����Զ�������β��Һ�ѹ�����е�JS
SET JSFOLDER=%cd%
echo ���ڲ���JS�ļ�
chdir /d %JSFOLDER%
for /r . %%a in (*.js) do (
    @echo ����ѹ�� %%~a ...
    uglifyjs %%~fa  -o %%~fa
)
echo JSѹ�����!
@echo off
pause