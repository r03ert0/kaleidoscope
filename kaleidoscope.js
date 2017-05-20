var ca1;
var	context;
var px;
var	w,h;

var ca2;
var	kacontext;
var	kapx;
var	kaw,kah;

var	tri;
var img = new Image();
var	mouseIsDown=false;
var	p0,th0;

function configureTriangle(t)
{
	var	sq=Math.sqrt(3)/2;
	var	theta=t.theta;
	
	t.x0=t.x-t.L/2;
	t.y0=t.y-t.L*sq/3;
	t.x1=t.x+t.L/2;
	t.y1=t.y-t.L*sq/3;
	t.x2=t.x;
	t.y2=t.y+t.L*sq*2/3;

	x=(t.x0-t.x)*Math.cos(theta)+(t.y0-t.y)*Math.sin(theta);
	y=-(t.x0-t.x)*Math.sin(theta)+(t.y0-t.y)*Math.cos(theta);
	t.x0=x+t.x;
	t.y0=y+t.y;
	
	x=(t.x1-t.x)*Math.cos(theta)+(t.y1-t.y)*Math.sin(theta);
	y=-(t.x1-t.x)*Math.sin(theta)+(t.y1-t.y)*Math.cos(theta);
	t.x1=x+t.x;
	t.y1=y+t.y;
	
	x=(t.x2-t.x)*Math.cos(theta)+(t.y2-t.y)*Math.sin(theta);
	y=-(t.x2-t.x)*Math.sin(theta)+(t.y2-t.y)*Math.cos(theta);
	t.x2=x+t.x;
	t.y2=y+t.y;
}

function kaleidoscope()
{
	var	i,i0;
	var	x,y;
	var	a0,a1;
	var	b0,b1;
	var	c0,c1;
	var	r,s,t;
	var	r0,s0,t0;
		
	for(x=0;x<kaw;x++)
	for(y=0;y<kah;y++)
	{
		a0=(x+kaw)-(y+kah)/Math.sqrt(3);
		a1=(y+kah)*2/Math.sqrt(3);
		c0=parseInt(a0/tri.L);
		c1=parseInt(a1/tri.L);
		i0=(3+c0%3-c1%3)%3;
		a0=(10*tri.L+a0)%tri.L;
		a1=(10*tri.L+a1)%tri.L;
		s=a0/tri.L;
		t=a1/tri.L;
		switch(i0)
		{
			case 0:
				s0=s;
				t0=t;
				if(s0<0||t0<0||s0+t0>1)
				{
					s0=1-t;
					t0=1-s;
				}
				break;
			case 1:
				s0=1-s-t;
				t0=s;
				if(s0<0||t0<0||s0+t0>1)
				{
					s0=s+t-1;
					t0=1-t;
				}
				break;
			case 2:
				s0=t;
				t0=1-s-t;
				if(s0<0||t0<0||s0+t0>1)
				{
					s0=1-s;
					t0=s+t-1;
				}
				break;
		}
		r0=1-s0-t0;
		b0=Math.round(r0*tri.x0+s0*tri.x1+t0*tri.x2);
		b1=Math.round(r0*tri.y0+s0*tri.y1+t0*tri.y2);
		i=(b1*w+b0)*4;
		kai=(y*kaw+x)*4;
		kapx.data[ kai ]  =px.data[ i ];
		kapx.data[ kai+1 ]=px.data[ i+1 ];
		kapx.data[ kai+2 ]=px.data[ i+2 ];
		kapx.data[ kai+3 ]=255;
	}
	kacontext.putImageData(kapx, 0, 0);
}
function mousedown(e){
	mouseIsDown = true;
	e.preventDefault();

	var	x=e.clientX-ca1.offsetLeft;
	var	y=e.clientY-ca1.offsetTop;
	if(e.shiftKey!=true)
		p0={x:x,y:y};
	else
		th0=x/100;
}
function mousemove(e){
	e.preventDefault();
	if(!mouseIsDown)
		return;

	var	x=e.clientX-ca1.offsetLeft;
	var	y=e.clientY-ca1.offsetTop;
	var	dx,dy,dth;
	
	if(e.shiftKey!=true)
	{
		dx=x-p0.x;
		dy=y-p0.y;
		p0={x:x,y:y};
		tri.x+=dx;
		tri.y+=dy;
	}
	else
	{
		dth=x/100-th0;	
		th0=x/100;
		tri.theta+=dth;
	}
	configureTriangle(tri);

	context.clearRect(0,0,w,h);
	context.drawImage(img,0,0,w,h);
	context.beginPath();
	context.moveTo(tri.x0,tri.y0);
	context.lineTo(tri.x1,tri.y1);
	context.lineTo(tri.x2,tri.y2);
	context.closePath();
	context.strokeStyle = 'black';
	context.stroke();
	
	kaleidoscope()
}
function mouseup(e){
	mouseIsDown = false;
}
function handleFileSelect(evt)
{
	var file = evt.target.files[0];
	var filename=file.name;
	img.src = URL.createObjectURL(evt.target.files[0]);
	loadImage();
}
function loadImage()
{
	img.onload = function() {
		w=this.width;
		h=this.height;
		ca1.width=w;
		ca1.height=h;
		context.drawImage(this,0,0,w,h);
		px=context.getImageData(0,0,ca1.width,ca1.height);

		tri.x=w/2;
		tri.y=h/2;
		tri.theta=0;
		configureTriangle(tri);
		context.beginPath();
		context.moveTo(tri.x0,tri.y0);
		context.lineTo(tri.x1,tri.y1);
		context.lineTo(tri.x2,tri.y2);
		context.closePath();
		context.strokeStyle = 'black';
		context.stroke();
	
		kaleidoscope()
	}
}

// The global variable Siph contains the configuration settings for all the
// widget instances that need to be created (here i'm just using the 1st one)

var div = Siph.settings[0].container;
document.body.appendChild(div);
div.setAttribute('id',Siph.settings[0].id);
div.innerHTML=[
"<b>"+Siph.settings[0].name+"</b>",
"<table border=0>",
"<tr>",
"<td>",
"<input type='file' id='file' name='files[]'/><br/>",
"<canvas id='image' style='border:1px solid black'></canvas>",
"</td>",
"<td>",
"<canvas id='kaleidoscope'></canvas>",
"</td>",
"</tr>",
"</table>"].join("\n");

document.getElementById('file').addEventListener('change', handleFileSelect, false);

ca1 = document.getElementById('image');
context=ca1.getContext('2d');
ca1.onmousedown = mousedown;
ca1.onmouseup = mouseup;
ca1.onmousemove = mousemove;

ca2=document.getElementById('kaleidoscope');
kacontext=ca2.getContext('2d');
kaw=640;
kah=640;
ca2.width=kaw;
ca2.height=kah;
kapx=kacontext.getImageData(0,0,kaw,kah);

tri={L:150,x:0,y:0,theta:0};

img.src = "brain.png";
loadImage();
