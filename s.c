#include<stdio.h>
void  main()
{
    int i,n,a[100005],small;
    scanf("%d",&n) ;
    for(i=0;i<n;i++)
    {
        scanf("%d",&a[i]) ;
    }
    small=a[0];
    for(i=1;i<n;i++)   
    {
        if(a[i]<small)
        {
            small=a[i];
        }
    }
    printf("%d",small);
}