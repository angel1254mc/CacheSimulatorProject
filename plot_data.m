cache_size = [1024, 2048, 4096, 8192, 16384, 32768];
  
caches = [ 0.8092141877859073, 0.872937444127497, 0.8825887221413155,0.8880087185344485,0.9015208955889568, 0.888600167156955,0.9041368437586657, 0.9168888638950673, 0.927048205971498;
        0.8546258069395346,0.899729097139134,0.9062175794044015,0.9114533540954424,0.9209940990880057,0.913088079304534,0.923346319347351,0.9245214598891179,0.9302730553460168;
        0.9008635149888594, 0.9207090402437156, 0.9250004363145576, 0.9228750996251573, 0.928739167279123, 0.9235479936317467, 0.9290940364526269, 0.9303079605106238, 0.9336491604338324;
        0.9183083405890828, 0.9284230816218491, 0.931296940174487, 0.9298076531512577, 0.9331236437889169, 0.9301237388085316, 0.9335483232916346, 0.9333214397216895, 0.9355243434435496;
        0.929063009639643, 0.9325108642324839, 0.9343744121873322, 0.9332399943376066, 0.9352489804783171, 0.9334474861494367, 0.9355146475644921, 0.9351384474570618, 0.9365075055799784;
        0.9330131107676616, 0.9351830485007262, 0.9362670477793528, 0.9354273846529748, 0.9365094447557899, 0.9357046867940189, 0.9367227540950546, 0.9362185683840654, 0.937046596455574
    ];

plot(cache_size, caches(:,1), '-o');
hold on;
plot(cache_size, caches(:,2), '-o','LineWidth',2);
plot(cache_size, caches(:,3), '-o','LineWidth',2);
plot(cache_size, caches(:,4), '-o','LineWidth',2);
plot(cache_size, caches(:,5), '-o','LineWidth',2);
plot(cache_size, caches(:,6), '-o','LineWidth',2);
plot(cache_size, caches(:,7), '-o','LineWidth',2);
plot(cache_size, caches(:,8), '-o','LineWidth',2);
plot(cache_size, caches(:,9), '-o','LineWidth',2);
xlim([0 40000]);
ylim([0.80 1.0]);
legend("Direct Map Cache", "2-way Set Associative (FIFO)", "2-way Set Associative (LRU)","4-way Set Associative (FIFO)", "4-way Set Associative (LRU)", "8-way Set Associative (FIFO)", "8-way Set Associative (LRU)", "Fully Associative (FIFO)", "Fully Associative (LRU)" );